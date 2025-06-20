import { Component } from '@angular/core';
import { NavigationService } from '../../../core/services';
import { PresetType } from '../../../core/models/domain/types';

@Component({
    selector: 'app-preset-filter',
    templateUrl: 'preset-filter.component.html',
    standalone: true
})
export class PresetFilterComponent {

    constructor(
        private navigationService: NavigationService
    ) { }

    public onSelectPresetTap(preset: PresetType) {
        this.navigationService.navigate(['backlog', preset]);
    }
}
