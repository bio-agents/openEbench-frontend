import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { KeycloakService } from "keycloak-angular";
import { KeycloakProfile } from "keycloak-js";

/**
 * This component is where the we specify the top menu paths
 */
@Component({
    selector: "app-top-menu",
    templateUrl: "./top-menu.component.html",
    styleUrls: ["./top-menu.component.css"],
})
/**
 * Class top menu component
 */
export class TopMenuComponent implements OnInit {
    /**
     * User details from keycloak
     */
    userDetails: KeycloakProfile;

    /**
     * Construtor method
     */
    constructor(
        private location: Location,
        private keycloakService: KeycloakService
    ) {}

    /**
     * Navigation links and labels for the menu on the right (LOGO)
     */
    public dashboardLink = {
        label: "Dashboard",
        path: "dashboard",
    };

    /**
     * Navigation links and labels for the menu on the left
     */
    public navLinks: any[];
    public navDocs: any[];

    /**
     * Call the getProfileName function on start
     */
    ngOnInit() {

        this.navLinks = [
            {
                label: "Scientific Benchmarking",
                path: "/scientific",
            },
            {
                label: "Technical Monitoring",
                path: "/agent",
            },
            {
                label: "Statistics",
                path: "/stats",
            },
            {
                label: "About",
                path: "/about",
            },
            {
                label: "Docs",
                path: "",
                href: "",
            },
            {
                label: "Feedback",
                path: "",
                href: "https://bsc3.typeform.com/to/wUKOEDiM",
            },
        ];
        this.getProfileName();

        this.navDocs = [
            {
                label: "Technical",
                path: "",
                href: "https://openebench.bsc.es/docs/"
            },
            {
                label: "Read the docs",
                path: "",
                href: "https://openebench.readthedocs.io/en/latest/"
            }
        ]
    }

    /**
     * Gets the name of the user to add toggle between login and username
     */
    getProfileName() {
        this.keycloakService.isLoggedIn().then((res) => {
            if (res) {
                this.keycloakService.loadUserProfile().then((resp) => {
                    this.navLinks.push({
                        label: resp.username,
                        path: "/private",
                    });
                });
            } else {
                this.navLinks.push({
                    label: "Login",
                    path: "/private",
                    isBtn: true,
                });
            }
        });
    }

    /**
     * Get URL path
     */
    getPath() {
        return this.location.isCurrentPathEqualTo(this.dashboardLink.path);
    }
}
