export interface Expense {
    id: number;
    title: string;
    amount: number;
    category: string | null;
    expense_date: string;
    created_at?: string;
    updated_at?: string;
}

export type ExpenseFormData = Omit<Expense, 'id' | 'created_at' | 'updated_at'>;
