import { Component, OnInit, ViewChild } from "@angular/core";
import { Agent } from "../shared/agent";
import { MatPaginator } from "@angular/material/paginator";
import { AgentService } from "../shared/agent.service";

import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { Filter } from "../shared/filter";
// import { Stats } from '../../shared/stats';
import { Router, ActivatedRoute } from "@angular/router";
import { Metrics } from "../shared/metrics";
import { Title } from "@angular/platform-browser";

/**
 * Component to list the agents
 */
@Component({
    selector: "app-agent-table",
    templateUrl: "./agent-table.component.html",
    styleUrls: ["./agent-table.component.css"],
})

/**
 * Class AgentTable Component
 */
export class AgentTableComponent implements OnInit {
    cdr = [
        "ensembl",
        "ensembl_genomes",
        "europe_pmc",
        "proteinatlas",
        "intact",
        "mint",
        "interpro",
        "orphadata",
        "pdbe",
        "pride",
        "silva",
        "string",
    ];

    public typeList = [
        "cmd",
        "web",
        "db",
        "app",
        "lib",
        "ontology",
        "workflow",
        "plugin",
        "sparql",
        "soap",
        "script",
        "rest",
        "workbench",
        "suite",
    ];

    /**
     * options
     */
    public options: string[];
    /**
     * filter
     */
    private filter: Filter;
    /**
     * filterValue
     */
    public filterValue: string;
    public edamFilterValue: string;
    /**
     * search
     */
    public search: FormGroup;
    /**
     * agents
     */
    public agents: Agent[];
    /**
     * metrics
     */
    public metrics: Metrics[];
    /**
     * skip
     */
    private skip: number;
    /**
     * limit
     */
    private limit: number;
    /**
     * length
     */
    public length: number;

    public optionss: FormGroup;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    /**
     * Construtor for the agent table;
     */

    pageTitle = "Technical monitoring";
    constructor(
        private agentService: AgentService,
        private route: ActivatedRoute,
        private router: Router,
        fb: FormBuilder,
        private titleService: Title
    ) {
        this.optionss = fb.group({
            bottom: 0,
            fixed: false,
            top: 100,
        });
    }

    /**
     * On init method checks for search param in the url or filters applied
     */
    ngOnInit() {
        this.titleService.setTitle(this.pageTitle);
        this.filterValue = this.getQueryParam("search");
        this.filter = {
            text:
                this.getQueryParam("search") != null
                    ? this.getQueryParam("search")
                    : "",
            filter:
                this.getQueryParam("filter") != null
                    ? this.getQueryParam("filter")
                    : "",
            type:
                this.getQueryParam("type") != null
                    ? this.getQueryParam("type")
                    : "",
            label:
                this.getQueryParam("label") != null
                    ? this.getQueryParam("label")
                    : "",
        };
        this.skip = 0;
        this.limit = 10;

        this.initializeForm();
    }

    /**
     * Helper method to get the query param
     */
    private getQueryParam(param: string): string {
        return this.route.snapshot.queryParamMap.get(param);
    }

    /**
     * Gets the agents
     */
    private getAgents(): void {
        this.agentService
            .getAgentWithFilters(this.filter, this.skip, this.limit)
            .subscribe((res) => {
                this.agents = res.body;
                this.length = res.headers.get('Content-Range').split('/')[1];
            });
    }

    /**
     * Change page (Paginator)
     */
    public changePage(event) {
        this.skip = event.pageIndex * event.pageSize;
        this.limit = event.pageIndex * event.pageSize + event.pageSize;
        this.getAgents();
    }

    /**
     * Initialize search from
     */
    private initializeForm() {
        this.options = ["Name", "Name & Description", "Description"];
        this.search = new FormGroup(
            (this.filter = {
                text: new FormControl(this.filterValue),
                filter: new FormControl(this.options[0]),
                type: new FormControl(),
                label: new FormControl(this.edamFilterValue),
            })
        );
        this.submitForm();
    }

    /**
     * Submit search form
     */
    public submitForm() {
        this.filter = {
            text: this.search.value.text == null ? "" : this.search.value.text,
            filter: this.search.value.filter,
            type: this.search.value.type,
            label: this.search.value.label,
        };
        this.router.navigate([], {
            queryParams: { search: this.filter.text },
            queryParamsHandling: "merge",
        });
        if (this.paginator) {
            this.paginator.firstPage();
        }
        this.getAgents();
    }

    /**
     * Url Metrics for agents
     */
    public getMetricsForAgent(id) {}

    public onActivate($event) {
        console.log($event);
    }
    public onDeactivate($event) {
        console.log($event);
    }
}
