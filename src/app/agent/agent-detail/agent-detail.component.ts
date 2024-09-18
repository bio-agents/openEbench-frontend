import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { Observable, bindCallback } from "rxjs";
import { AgentTableComponent } from "../agent-table/agent-table.component";
import * as c3 from "c3";
import * as d3 from "d3";
import { Filter } from "../shared/filter";
import { Agent } from "../shared/agent";
import { Metrics } from "../shared/metrics";
import { AgentService } from "../shared/agent.service";
import uptime from "../shared/uptime.js";
import citation from "../shared/citation.js";
import { Input } from "@angular/core";
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { SourceListMap } from "source-list-map";
import { Title } from "@angular/platform-browser";

/**
 * Component for agent details
 */
@Component({
    selector: "app-agent-detail",
    templateUrl: "./agent-detail.component.html",
    styleUrls: ["./agent-detail.component.css"],
})
export class AgentDetailComponent implements OnInit {
    tableOfContent = ["Metrics", "Uptime", "Publication"];

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
    /**
     *  panelOpenState
     */
    panelOpenState = true;
    /**
     *  agents
     */
    agents: Agent[];
    /**
     *  filter
     */
    filter: Filter;
    /**
     *  id
     */
    id: string;
    /**
     *  instance
     */
    instance: string;
    /**
     *  version
     */
    version: string;
    /**
     *  selectedValue
     */
    selectedValue: any;
    /**
     *  metrics
     */
    metrics: Metrics[];
    /**
     *  charts
     */
    charts: string;
    /**
     *  sources
     */
    sources: any = [];

    /**
     * Constructor
     */
    animal: string;
    name: string;

    constructor(
        private agentService: AgentService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private titleService: Title
    ) {}

    /**
     * Initializer
     */
    ngOnInit() {
        this.id = this.getParam("id");
        this.titleService.setTitle(this.id);
        this.getAgentById();
    }

    /**
     * Get param from url
     */
    public getParam(param: string): string {
        return this.route.snapshot.paramMap.get(param);
    }

    /**
     * Find agent by id
     */
    private getAgentById(): void {
        this.agentService.getAgentById(this.id).subscribe((agents) => {
            this.agents = agents;
            if (this.agents.length !== 0) {
                this.getSources(this.agents);
                this.selectInitialValue(1);
            }
        });
    }

    /**
     * Source of info (Bio.agents, Galaxy, Biocontainers etc .... )
     */
    private getSources(agents) {
        let i = 0;
        agents.forEach((agent) => {
            agent.entities.forEach((entity) => {
                entity.agents.forEach((element) => {
                    const str = element["@id"];
                    const s = str.split("/agent/")[1].split(":")[0];
                    if (i > 0) {
                        if (!this.sources.includes(s)) {
                            this.sources.push(s);
                        }
                    }
                    i++;
                });
            });
        });
    }

    /**
     * Helper function for getSource
     */
    public sourceHref(source, agent) {
        switch (source) {
            case "bioagents":
                window.open("https://bio.agents/" + agent, "_blank");
                break;
            case "bioconda":
                window.open("https://anaconda.org/bioconda/" + agent, "_blank");
                break;
            case "galaxy":

            default:
                break;
        }
    }
    /**
     * metrics that loads the graphs
     */
    private getMetrics() {
        this.selectedValue["metrics"] = this.selectedValue["@id"].replace(
            "/agent/",
            "/metrics/"
        );
        this.agentService
            .getAgentMetricsById(this.selectedValue.metrics)
            .subscribe((res) => {
                this.metrics = res;
            });
        setTimeout(() => {
            this.loadCharts();
        }, 1000);
    }

    /**
     * helper function for loading the charts
     */
    private loadCharts() {
        citation.loadCitationChart();
        uptime.loadChart();
    }

    /**
     * setting whcih version of agent to be shown first
     */
    private selectInitialValue(i) {
        this.selectedValue = this.agents[0].entities[i].agents[0];
        this.getMetrics();
    }

    /**
     * Managing the tab change
     */
    public onTabChange(e) {
        this.selectInitialValue(e.index + 1);
    }

    /**
     * Managing the versoions
     */
    public onVersionChange(e) {
        this.metrics = null;
        this.getMetrics();
    }
}
