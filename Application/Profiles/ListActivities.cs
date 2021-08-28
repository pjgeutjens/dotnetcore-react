using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Predicate { get; set; }
            public string UserName { get; set; }
        }
        
        public class Handler : IRequestHandler<Query,Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }
            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.ActivityAttendees
                    .Where(d => d.AppUser.UserName == request.UserName)
                    .OrderBy(a => a.Activity.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        query = query.Where(d => d.Date < DateTime.UtcNow);
                        break;
                    case "future":
                        query = query.Where(d => d.Date >= DateTime.UtcNow);
                        break;
                    case "hosting":
                        query = query.Where(d => d.HostUserName == request.UserName);
                        break;
                }

                var result = await query.ToListAsync(cancellationToken);
                
                return Result<List<UserActivityDto>>.Success(result);
            }
        }
    }
}