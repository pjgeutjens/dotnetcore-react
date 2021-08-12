import { makeAutoObservable, runInAction } from "mobx"
import agent from "../api/agent";
import { Activity } from "../models/activity"
import {v4 as uuid} from 'uuid'

export default class ActivityStore {
    activities: Activity[] = [];
    activityRegistry = new Map<string,Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false
    loading = false
    loadingInitial = true

    constructor() {
        makeAutoObservable(this, {
        })
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    }


    loadActivities = async () => {
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                activity.date = activity.date.split('T')[0]
                this.activityRegistry.set(activity.id, activity);
            })
            this.setLoadingInital(false)

        } catch (error) {
            console.log(error);
            this.setLoadingInital(false)
        }
    }

    setLoadingInital = (state: boolean) => {
        this.loadingInitial = state;
    }

    setLoading = (state: boolean) => {
        this.loading = state;
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    createActivity = async (activity: Activity) => {
        this.setLoading(true)
        activity.id = uuid()
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity)
                this.selectedActivity = activity
                this.editMode = false
                this.loading = false
            })
        } catch (error) {
            console.log(error)
            this.setLoading(false)
        }

    }

    updateActivity = async (activity: Activity) => {
        this.setLoading(true)
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity)
                this.selectedActivity = activity
                this.editMode = false
                this.loading = false
            })
        } catch (error) {
            console.log(error)
            this.setLoading(false)
        }

    }

    deleteActivity = async (id: string) => {
        this.setLoading(true)
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                if (this.selectedActivity?.id === id) this.cancelSelectedActivity();
                this.loading = false
            })
        } catch (error) {
            console.log(error)
            this.setLoading(false)
        }

    }
}