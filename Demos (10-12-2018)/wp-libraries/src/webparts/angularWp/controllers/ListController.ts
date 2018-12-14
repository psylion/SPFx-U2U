import * as angular from 'angular';

import { SPHttpClient } from '@microsoft/sp-http';
import { IWebPartContext } from "@microsoft/sp-webpart-base";

export default class ListController implements angular.IController {
    public loading: boolean = false;
    public lists: any;
    private _context: IWebPartContext;

    //solves weak type check error with typescript 2.4
    public $onInit() { }

    constructor(private context: IWebPartContext, private $window: angular.IWindowService, private $rootScope: angular.IRootScopeService, private $timeout: angular.ITimeoutService) {
        const vm: ListController = this;
        this._context = context;
        this.init();

        // Listen to property changes
        $rootScope.$on('configurationChanged', (event: angular.IAngularEvent, args: { hiddenLists: boolean }): void => {
            vm.init(args.hiddenLists);
        });
    }

    private init(hiddenLists: boolean = false): void {
        const vm: ListController = this;
        vm.loading = true;
        this._loadLists(hiddenLists).then(response => {
            // Timeout calls the apply, better than $scope.apply
            this.$timeout(() => {
                vm.loading = false;
                vm.lists = response.value.map(list => {
                    return {
                        title: list.Title,
                        path: list.RootFolder.ServerRelativeUrl,
                        hidden: list.Hidden
                    };
                });
            });
        });
    }

    private _loadLists(showHidden): Promise<any> {
        // Retrieve all lists from the current site
        return this._context.spHttpClient.get(`${this._context.pageContext.web.absoluteUrl}/_api/web/lists?$filter=Hidden eq ${showHidden}&$select=Title,Hidden,RootFolder/ServerRelativeUrl&$expand=RootFolder`, SPHttpClient.configurations.v1)
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
    }
}