using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Profiles
{
    public class ProfileValidator : AbstractValidator<Profile>
    {
        public ProfileValidator()
        {
            RuleFor(x => x.DisplayName).NotEmpty();
        }
    }
}
