import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'nwn-loaded-scenario-header',
    templateUrl: './loaded-scenario-header.component.html',
    styleUrls: ['./loaded-scenario-header.component.css'],
})
export class LoadedScenarioHeaderComponent {
    @Input()
    title: string = 'Galaxy promo scenario';
    @Output()
    modalEvent = new EventEmitter<string>();

    sendMessage(modalType: string): void {
        this.modalEvent.emit(modalType);
    }

    isShowDivIf = true;

    toggleDisplayDivIf() {
        this.isShowDivIf = !this.isShowDivIf;
    }

    singleSelect: any = [];
    config = {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: false,
    };
    optionsNormal = [
        {
            _id: '3years',
            index: 0,
            balance: '$2,806.37',
            picture: 'http://placehold.it/32x32',
            name: '3 years',
        },
        {
            _id: '1year',
            index: 1,
            balance: '$2,984.98',
            picture: 'http://placehold.it/32x32',
            name: '1 years',
        },
        {
            _id: '2year',
            index: 1,
            balance: '$2,984.98',
            picture: 'http://placehold.it/32x32',
            name: '2 years',
        },
    ];

    options1 = [
        {
            _id: 'N230%(Co30%)',
            index: 0,
            name: 'N+2-30% (Co-30%)',
        },
        {
            _id: 'N230%(Co30%)s',
            index: 1,
            name: 'N+2-30% (Co-30%)',
        },
        {
            _id: 'N230%(Co30%)a',
            index: 1,
            name: 'N+2-30% (Co-30%)',
        },
    ];
    options2 = [
        {
            _id: 'N230%(Co30%)1',
            index: 0,
            name: 'N+2-30% (Co-30%)1',
        },
        {
            _id: 'N230%(Co30%)s2',
            index: 1,
            name: 'N+2-30% (Co-30%)2',
        },
        {
            _id: 'N230%(Co30%)a3',
            index: 1,
            name: 'N+2-30% (Co-30%)3',
        },
    ];
    options3 = [
        {
            _id: 'N230%(Co30%)2',
            index: 0,
            name: 'N+2-30% (Co-30%)2',
        },
        {
            _id: 'N230%(Co30%)s2',
            index: 1,
            name: 'N+2-30% (Co-30%)4',
        },
        {
            _id: 'N230%(Co30%)a3',
            index: 1,
            name: 'N+2-30% (Co-30%)3',
        },
    ];
}
