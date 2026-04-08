import { CustomerCredit, CreditTransaction } from '../types';

export class CreditManager {
  private customerCredits: Map<string, CustomerCredit>;
  private readonly MAX_LOAN_ITEMS = 5;
  private readonly MAX_LOAN_AMOUNT = 500.00;
  private readonly INTEREST_RATE = 0.10; // 10% interest per month
  private readonly PAYMENT_TERM_DAYS = 30;

  constructor() {
    this.customerCredits = new Map();
    this.initializeSampleCredits();
  }

  private initializeSampleCredits() {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    this.customerCredits.set('john65', {
      username: 'john65',
      currentLoanItems: 3,
      currentLoanAmount: 150.00,
      creditLimit: 500.00,
      creditScore: 'Good',
      nextPaymentDueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      transactionHistory: []
    });

    this.customerCredits.set('sarah55', {
      username: 'sarah55',
      currentLoanItems: 1,
      currentLoanAmount: 45.00,
      creditLimit: 500.00,
      creditScore: 'Excellent',
      nextPaymentDueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      transactionHistory: []
    });

    this.customerCredits.set('mike30', {
      username: 'mike30',
      currentLoanItems: 0,
      currentLoanAmount: 0.00,
      creditLimit: 500.00,
      creditScore: 'New Customer',
      nextPaymentDueDate: null,
      transactionHistory: []
    });
  }

  canGetCredit(username: string, requestedItems: number, totalAmount: number): boolean {
    let credit = this.customerCredits.get(username);
    
    if (!credit) {
      credit = {
        username,
        currentLoanItems: 0,
        currentLoanAmount: 0.00,
        creditLimit: this.MAX_LOAN_AMOUNT,
        creditScore: 'New Customer',
        nextPaymentDueDate: null,
        transactionHistory: []
      };
      this.customerCredits.set(username, credit);
    }

    if (this.hasOverduePayments(credit)) {
      return false;
    }

    return (credit.currentLoanItems + requestedItems <= this.MAX_LOAN_ITEMS) &&
           (credit.currentLoanAmount + totalAmount <= credit.creditLimit);
  }

  applyForCredit(username: string, items: number, amount: number): {
    approved: boolean;
    message: string;
    interestAmount: number;
    dueDate: Date | null;
  } {
    if (!this.canGetCredit(username, items, amount)) {
      const credit = this.customerCredits.get(username);
      const reason = credit && this.hasOverduePayments(credit) 
        ? 'Overdue payments' 
        : 'Credit limit exceeded';
      return { approved: false, message: reason, interestAmount: 0, dueDate: null };
    }

    const credit = this.customerCredits.get(username)!;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + this.PAYMENT_TERM_DAYS);

    const interestAmount = amount * this.INTEREST_RATE;
    const totalWithInterest = amount + interestAmount;

    credit.currentLoanItems += items;
    credit.currentLoanAmount += totalWithInterest;
    credit.nextPaymentDueDate = dueDate;

    const transaction: CreditTransaction = {
      type: 'LOAN',
      items,
      amount: totalWithInterest,
      date: new Date(),
      dueDate
    };

    credit.transactionHistory.push(transaction);
    this.updateCreditScore(credit);

    return {
      approved: true,
      message: 'Credit approved',
      interestAmount,
      dueDate
    };
  }

  makePayment(username: string, amount: number) {
    const credit = this.customerCredits.get(username);
    if (!credit) return;

    credit.currentLoanAmount = Math.max(0, credit.currentLoanAmount - amount);
    const itemsPaid = Math.floor(amount / 100);
    credit.currentLoanItems = Math.max(0, credit.currentLoanItems - itemsPaid);

    const transaction: CreditTransaction = {
      type: 'PAYMENT',
      items: itemsPaid,
      amount,
      date: new Date()
    };

    credit.transactionHistory.push(transaction);

    if (credit.currentLoanAmount <= 0) {
      credit.nextPaymentDueDate = null;
    }

    this.updateCreditScore(credit);
  }

  calculateInterest(username: string, amount: number): number {
    const credit = this.customerCredits.get(username);
    if (credit && this.hasOverduePayments(credit)) {
      return amount * (this.INTEREST_RATE + 0.05); // 15% total for overdue
    }
    return amount * this.INTEREST_RATE;
  }

  private hasOverduePayments(credit: CustomerCredit): boolean {
    if (!credit.nextPaymentDueDate) return false;
    return new Date() > credit.nextPaymentDueDate;
  }

  private updateCreditScore(credit: CustomerCredit) {
    const utilization = (credit.currentLoanAmount / credit.creditLimit) * 100;
    const hasOverdue = this.hasOverduePayments(credit);

    if (hasOverdue) {
      credit.creditScore = 'Poor - Overdue';
    } else if (utilization < 25) {
      credit.creditScore = 'Excellent';
    } else if (utilization < 50) {
      credit.creditScore = 'Good';
    } else if (utilization < 75) {
      credit.creditScore = 'Fair';
    } else {
      credit.creditScore = 'Poor';
    }
  }

  getCustomerCredit(username: string): CustomerCredit | undefined {
    return this.customerCredits.get(username);
  }

  getAllCredits(): CustomerCredit[] {
    return Array.from(this.customerCredits.values());
  }
}

export const creditManager = new CreditManager();




