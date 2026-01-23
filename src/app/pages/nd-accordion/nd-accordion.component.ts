import { Component } from '@angular/core';

@Component({
  selector: 'app-nd-accordion',
  templateUrl: './nd-accordion.component.html',
  styleUrls: ['./nd-accordion.component.scss']
})
export class NdAccordionComponent {
    toggleNdAccordion(collapseId: string, event: Event): void {
    const button = event.target as HTMLButtonElement;
    const collapseElement = document.getElementById(collapseId);
    const accordion = button.closest('.nd-accordion');
    
    if (!collapseElement || !accordion) return;
    
    // Check if this accordion item is currently open
    const isOpen = collapseElement.classList.contains('nd-show');
    
    // Close all accordion items in this accordion
    const allCollapses = accordion.querySelectorAll('.nd-accordion-collapse');
    const allButtons = accordion.querySelectorAll('.nd-accordion-button');
    
    allCollapses.forEach(collapse => collapse.classList.remove('nd-show'));
    allButtons.forEach(btn => btn.classList.add('nd-collapsed'));
    
    // If it wasn't open, open it
    if (!isOpen) {
      collapseElement.classList.add('nd-show');
      button.classList.remove('nd-collapsed');
    }
  }

  openNdTab(event: Event, tabId: string): void {
    const target = event.currentTarget as HTMLButtonElement;
    
    // Hide all tab panes
    const tabPanes = document.querySelectorAll('.nd-tab-pane');
    tabPanes.forEach((pane: Element) => {
      pane.classList.remove('nd-show');
    });

    // Remove active class from all buttons
    const tabLinks = document.querySelectorAll('.nd-nav-link');
    tabLinks.forEach((link: Element) => {
      link.classList.remove('nd-active');
    });

    // Show the selected tab pane
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
      selectedTab.classList.add('nd-show');
    }

    // Add active class to the clicked button
    target.classList.add('nd-active');
  }
}
