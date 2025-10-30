import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BillingService } from '../billing/billing.service';
import { Subscription } from '../billing/subscription.model';
import { BadgeModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, GridModule, TableModule, BadgeModule]
})
export class SubscriptionsComponent implements OnInit {

  subscriptionsByMonth: { month: string, subscriptions: Subscription[] }[] = [];

  constructor(private billingService: BillingService) { }

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.billingService.getAllSubscriptions().subscribe(subscriptions => {
      this.groupSubscriptionsByMonth(subscriptions);
    });
  }

  groupSubscriptionsByMonth(subscriptions: Subscription[]): void {
    const groups: { [key: string]: Subscription[] } = {};
    subscriptions.forEach(sub => {
      const month = sub.startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(sub);
    });

    this.subscriptionsByMonth = Object.keys(groups).map(month => {
      return { month, subscriptions: groups[month] };
    });
  }
}
