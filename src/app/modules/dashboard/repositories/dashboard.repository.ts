import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment as env } from '../../../../environments/environment';


import { StatusCounts, PriorityCounts, TypeCounts } from '../models';
import { PtItem } from '../../../core/models/domain';
import { DashboardFilter } from '../../../shared/models/dto/stats/dashboard-filter';


export interface ItemsForMonth {
    closed: PtItem[];
    open: PtItem[];
}

export interface FilteredIssues {
    categories: Date[];
    items: ItemsForMonth[];
}

@Injectable()
export class DashboardRepository {
    constructor(private http: HttpClient) { }

    private getFilterParamString(filter: DashboardFilter): string {
        const params = [
            filter.userId ? `userId=${filter.userId}` : '',
            filter.dateStart ? `dateStart=${filter.dateStart.toDateString()}` : '',
            filter.dateEnd ? `dateEnd=${filter.dateEnd.toDateString()}` : ''
        ];
        const paramStr = params.join('&');
        return paramStr;
    }
    private getStatusCountsUrl(paramStr: string): string {
        return `${env.apiEndpoint}/stats/statuscounts?${paramStr}`;
    }

    private getPriorityCountsUrl(paramStr: string): string {
        return `${env.apiEndpoint}/stats/prioritycounts?${paramStr}`;
    }

    private getTypeCountsUrl(paramStr: string): string {
        return `${env.apiEndpoint}/stats/prioritycounts?${paramStr}`;
    }

    private getFilteredIssuesUrl(paramStr: string): string {
        return `${env.apiEndpoint}/stats/filteredissues?${paramStr}`;
    }

    public getStatusCounts(filter: DashboardFilter): Observable<StatusCounts> {
        return this.http.get<StatusCounts>(this.getStatusCountsUrl(this.getFilterParamString(filter)));
    }

    public getPriorityCounts(filter: DashboardFilter): Observable<PriorityCounts> {
        return this.http.get<PriorityCounts>(this.getPriorityCountsUrl(this.getFilterParamString(filter)));
    }

    public getTypeCounts(filter: DashboardFilter): Observable<TypeCounts> {
        return this.http.get<TypeCounts>(this.getTypeCountsUrl(this.getFilterParamString(filter)));
    }

    public getFilteredIssues(filter: DashboardFilter): Observable<FilteredIssues> {
        return this.http.get<FilteredIssues>(this.getFilteredIssuesUrl(this.getFilterParamString(filter)));
    }
}
