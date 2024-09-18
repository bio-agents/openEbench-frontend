import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AgentTableComponent } from "./agent-table/agent-table.component";
import { AgentDetailComponent } from "./agent-detail/agent-detail.component";

const routes: Routes = [
    {
        path: "",
        children: [
            { path: "", component: AgentTableComponent },
            { path: ":id", component: AgentDetailComponent },
        ],
    },
];

@NgModule({
    /**
     * Import RouterModule
     * This is a child module so we use forChild
     */
    imports: [RouterModule.forChild(routes)],
    /**
     * Export RoutingModule
     */
    exports: [RouterModule],
})

/**
 * Export Routing Module
 */
export class AgentRoutingModule {}

/**
 * Export routing components
 */
export const AllAgentRoutingComponents = [
    AgentTableComponent,
    AgentDetailComponent,
];
