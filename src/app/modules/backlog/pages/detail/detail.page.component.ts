import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';

import { Subscription, BehaviorSubject, Observable } from 'rxjs';

import { SelectEvent, TabStripModule } from '@progress/kendo-angular-layout';


import { BacklogService } from '../../services/backlog.service';

import { PtItemChitchatComponent } from '../../components/detail/item-chitchat/pt-item-chitchat.component';
import { PtItemTaskScheduleComponent } from '../../components/detail/item-task-schedule/pt-item-task-schedule.component';
import { PtItemTasksComponent } from '../../components/detail/item-tasks/pt-item-tasks.component';
import { PtItem, PtTask, PtComment, PtUser } from '../../../../core/models/domain';
import { NavigationService, PtUserService } from '../../../../core/services';
import { Store } from '../../../../core/state/app-store';
import { PtNewTask, PtTaskUpdate, PtNewComment } from '../../../../shared/models/dto';
import { DetailScreenType } from '../../../../shared/models/ui/types/detail-screens';
import { PtItemFormComponent } from '../../components';
import { BacklogRepository } from '../../repositories/backlog.repository';



@Component({
    selector: 'app-backlog-detail-page',
    templateUrl: 'detail.page.component.html',
    standalone: true,
    imports: [NgIf, TabStripModule, PtItemFormComponent, PtItemTasksComponent, PtItemTaskScheduleComponent, PtItemChitchatComponent, AsyncPipe],
    providers: [BacklogService, BacklogRepository]
})
export class DetailPageComponent implements OnInit, OnDestroy {

    private itemId = 0;
    private currentItemSub: Subscription | undefined;
    public selectedDetailsScreen: DetailScreenType = 'form' as DetailScreenType;

    public item: PtItem | undefined;
    public tasks$: BehaviorSubject<PtTask[]> = new BehaviorSubject<PtTask[]>([]);
    public comments$: BehaviorSubject<PtComment[]> = new BehaviorSubject<PtComment[]>([]);
    public currentUser$: Observable<PtUser>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private backlogService: BacklogService,
        private ptUserService: PtUserService,
        private navigationService: NavigationService,
        private store: Store
    ) {
        this.currentUser$ = this.store.select<PtUser>('currentUser');
    }


    public ngOnInit() {
        this.itemId = parseInt(this.activatedRoute.snapshot.params['id'], undefined);

        this.currentItemSub = this.backlogService.getPtItem(this.itemId)
            .subscribe(item => {
                this.item = item;
                this.tasks$.next(item.tasks);
                this.comments$.next(item.comments);
            });

        const screen = this.activatedRoute.snapshot.params['screen'] as DetailScreenType;
        if (screen === 'form' || screen === 'tasks' || screen === 'chitchat' || screen === 'schedule') {
            this.selectedDetailsScreen = screen;
        } else {
            this.navigationService.navigate([`/detail/${this.itemId}`]);
        }
    }

    public isTabSelected(screen: DetailScreenType) {
        return this.selectedDetailsScreen === screen;
    }

    public onTabSelect(e: SelectEvent) {
        const screen = e.title.toLowerCase() as DetailScreenType;
        this.selectedDetailsScreen = screen;
        this.navigationService.navigate([`/detail/${this.itemId}/${screen}`]);
    }

    public onUsersRequested(name: string) {
        this.ptUserService.fetchUsers(name);
    }

    public onAddNewTask(newTask: PtNewTask) {
        if (this.item) {
            this.backlogService.addNewPtTask(newTask, this.item).then(nextTask => {
                this.tasks$.next([nextTask].concat(this.tasks$.value));
            });
        }
    }

    public onUpdateTask(taskUpdate: PtTaskUpdate) {
        if (this.item) {
            if (taskUpdate.delete) {
                this.backlogService.deletePtTask(this.item, taskUpdate.task).then(ok => {
                    if (ok) {
                        const newTasks = this.tasks$.value.filter(task => {
                            if (task.id !== taskUpdate.task.id) {
                                return task;
                            }
                            return null;
                        });
                        this.tasks$.next(newTasks);
                    }
                });
            } else {
                this.backlogService.updatePtTask(this.item, taskUpdate.task, taskUpdate.toggle, taskUpdate.newTitle).then(updatedTask => {
                    const newTasks = this.tasks$.value.map(task => {
                        if (task.id === updatedTask.id) {
                            return updatedTask;
                        } else {
                            return task;
                        }
                    });
                    this.tasks$.next(newTasks);
                });
            }
        }
    }

    public onAddNewComment(newComment: PtNewComment) {
        if (this.item) {
            this.backlogService.addNewPtComment(newComment, this.item).then(nextComment => {
                this.comments$.next([nextComment].concat(this.comments$.value));
            });
        }
    }

    public onItemSaved(item: PtItem) {
        this.currentItemSub = this.backlogService.updatePtItem(item)
            .subscribe(updateItem => {
                this.item = updateItem;
            });
    }

    public ngOnDestroy(): void {
        if (this.currentItemSub) {
            this.currentItemSub.unsubscribe();
        }
    }
}
