import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { HttpClientModule } from "@angular/common/http";
import {
    AgentRoutingModule,
    AllAgentRoutingComponents,
} from "./agent-routing.module";
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from "../material.module";

import { AgentComponent } from "./agent.component";
import { AgentService } from "./shared/agent.service";

import { KeyValuePipe } from "./shared/pipes/key-value.pipe";
import { ChartIdPipe } from "./shared/pipes/chart-id.pipe";
import { SourceBadgeClassPipe } from "./shared/pipes/source-badge-class.pipe";
import { ContentTableModule } from "../content-table/content-table.module";

import { UptimeComponent } from "../uptime/uptime.component";

@NgModule({
    declarations: [
        AgentComponent,
        AllAgentRoutingComponents,
        KeyValuePipe,
        ChartIdPipe,
        SourceBadgeClassPipe,
        UptimeComponent,
    ],
    imports: [
        HttpClientModule,
        CommonModule,
        AgentRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        // BrowserAnimationsModule,
        MaterialModule,
        ContentTableModule,
    ],
    providers: [AgentService],
    bootstrap: [AgentComponent],
    exports: [],
})
export class AgentModule {}
