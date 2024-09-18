import { Component, OnInit } from "@angular/core";
import { StatisticsService } from "../shared/statistics.service";
import * as c3 from "c3";
import * as d3 from "d3";
import { setTimeout } from "timers";
import { Title } from "@angular/platform-browser";
/**
 *
 * Componet for Statistics
 */
@Component({
    selector: "app-statistics",
    templateUrl: "./statistics.component.html",
    styleUrls: ["./statistics.component.css"],
})
export class StatisticsComponent implements OnInit {
    /**
     * data
     */
    private data: any;

    /**
     * Visual loading flag
     */
    public loading = false;

    /**
     * constructor function
     */
    pageTitle = "Statistics";
    constructor(
        private statsService: StatisticsService,
        private titleService: Title
    ) {}
    /**
     * initializer
     */
    ngOnInit() {
        this.titleService.setTitle(this.pageTitle);
        this.fetchdata();
    }
    /**
     * fetches the data and generates the statistics charts
     */
    private fetchdata() {
        this.loading = true;
        this.statsService.getStats().subscribe(
            // 1
            (data) => {
                this.data = data;
            },
            // 2
            (err) => console.log(err),
            // 3
            () => {
                const statistics = {
                    agents: this.data["/@timestamp"],
                    publications: this.data["/project/publications"],
                    bioschemas: this.data["/project/website/bioschemas:true"],
                    opensource: this.data["/project/license/open_source:true"],
                };
                this.generateChart(statistics);
            }
        );
    }

    /**
     * helper method for the fechdata
     */

    private generateChart(data) {
        this.loading = false;
        c3.generate({
            size: {
                height: 340,
                width: 680,
            },
            title: {
                text: "Publications",
            },
            data: {
                columns: [
                    [
                        "Agents with no publications ",
                        data.agents - data.publications,
                    ],
                    ["Agents with publications", data.publications],
                ],
                type: "pie",
            },
            agenttip: {
                format: {
                    value: function (value) {
                        return (
                            d3.format(",")(value) +
                            " / " +
                            d3.format(",")(data.agents)
                        );
                    },
                },
            },
            bindto: "#agentspublications",
        });
        c3.generate({
            size: {
                height: 340,
                width: 680,
            },
            title: {
                text: "Bioschemas",
            },
            data: {
                columns: [
                    ["Agents with bioschemas", data.bioschemas],
                    ["Agents without bioschemas ", data.agents - data.bioschemas],
                ],
                type: "pie",
            },
            agenttip: {
                format: {
                    value: function (value) {
                        return (
                            d3.format(",")(value) +
                            " / " +
                            d3.format(",")(data.agents)
                        );
                    },
                },
            },
            bindto: "#agentsbioschemas",
        });
        c3.generate({
            size: {
                height: 340,
                width: 680,
            },
            data: {
                columns: [
                    ["Agents with opensource license", data.opensource],
                    [
                        "Agents without opensource license ",
                        data.agents - data.opensource,
                    ],
                ],
                type: "pie",
            },
            title: {
                text: "Open Source",
            },
            agenttip: {
                format: {
                    value: function (value) {
                        return (
                            d3.format(",")(value) +
                            " / " +
                            d3.format(",")(data.agents)
                        );
                    },
                },
            },
            bindto: "#agentsopensource",
        });
    }
}
