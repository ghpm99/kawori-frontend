import { apiDjango } from "..";

export interface IAnalyticsUsers {
    total: number;
    active: number;
    new_last_7_days: number;
    new_last_30_days: number;
    recently_active_last_30_days: number;
}

export interface IAnalyticsFeatureAdoption {
    financial: number;
    bdo: number;
}

export interface IAnalyticsRegistrationMonth {
    month: string;
    count: number;
}

export interface IAnalyticsDashboard {
    users: IAnalyticsUsers;
    feature_adoption: IAnalyticsFeatureAdoption;
    registrations_by_month: IAnalyticsRegistrationMonth[];
}

export async function fetchAnalyticsDashboard(): Promise<IAnalyticsDashboard> {
    const response = await apiDjango.get<IAnalyticsDashboard>("analytics/dashboard/");
    return response.data;
}
