import type { Expense, ExpenseFormData } from '../types';
const BASE_URL = 'http://localhost:8000/api';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export const api = {
    async getExpenses(): Promise<Expense[]> {
        const response = await fetch(`${BASE_URL}/expenses`, {
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch expenses');
        const json: ApiResponse<Expense[]> = await response.json();
        return json.data;
    },

    async getExpense(id: number): Promise<Expense> {
        const response = await fetch(`${BASE_URL}/expenses/${id}`, {
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch expense');
        const json: ApiResponse<Expense> = await response.json();
        return json.data;
    },

    async createExpense(expense: ExpenseFormData): Promise<Expense> {
        const response = await fetch(`${BASE_URL}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(expense),
        });
        if (!response.ok) {
             const errorData = await response.json();
             throw new Error(errorData.message || 'Failed to create expense');
        }
        const json: ApiResponse<Expense> = await response.json();
        return json.data;
    },

    async updateExpense(id: number, expense: ExpenseFormData): Promise<Expense> {
        const response = await fetch(`${BASE_URL}/expenses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(expense),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update expense');
        }
        const json: ApiResponse<Expense> = await response.json();
        return json.data;
    },

    async deleteExpense(id: number): Promise<void> {
        const response = await fetch(`${BASE_URL}/expenses/${id}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to delete expense');
    }
};
