# React Expense Tracker - Beginner's Guide

Welcome to your React Expense Tracker! This document explains how this project works, line-by-line, and introduces the core concepts of React used here.

## 🚀 How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start the Development Server**:
    ```bash
    npm run dev
    ```
    This will start a local server (usually at `http://localhost:5173`) where you can see your app.

---

## 📚 Key React Concepts

Before diving into the code, here are the main concepts used in this project:

### 1. Components (`.tsx` files)
Think of Components as custom HTML tags. Instead of just `<input>`, you can create `<ExpenseForm>`. They are reusable building blocks for your UI.
-   **Functional Components**: We write them as JavaScript/TypeScript functions that return HTML (JSX).

### 2. JSX (JavaScript XML)
The "HTML" you see inside the JavaScript files is actually **JSX**. It allows us to write HTML-like structures directly in our JS code.
-   **Rule**: You can only return *one* parent element (like a `<div>`).
-   **Dynamic Data**: You can put JavaScript variables inside `{}`. Example: `<h1>{title}</h1>`.

### 3. Props (Properties)
Props are how we pass data *down* from a parent component to a child component.
-   If `App` is the parent and `ExpenseList` is the child, `App` can pass the list of expenses to `ExpenseList` so it knows what to display.
-   Think of them like HTML attributes: `<ExpenseList expenses={myExpenses} />`.

### 4. State (`useState`)
State is the "memory" of a component. Normal variables disappear when a function finishes, but **State** is remembered by React.
-   When state changes, React automatically updates (re-renders) the screen.
-   **Syntax**: `const [count, setCount] = useState(0);`
    -   `count`: The current value.
    -   `setCount`: A function to update the value.

### 5. Effects (`useEffect`)
Effects let you run code when something happens *outside* of just showing HTML (side effects).
-   **Common use**: Fetching data from an API when the component first loads.
-   **Syntax**: `useEffect(() => { ... }, []);` (The empty `[]` means "run this only once when the app starts").

---

## 📂 Code Walkthrough

Here is an explanation of every important file in your `src` folder.

### 1. `src/types.ts`
This is a **TypeScript** file. It doesn't run code, but it defines the "shapes" of our data objects. This helps catch bugs (like typos) before you even run the app.

```typescript
export interface Expense {
    id: number;           // The unique ID from the database
    title: string;        // The name of the expense
    amount: number;       // The cost
    // ...
}
```

### 2. `src/services/api.ts`
This file handles all communication with your Laravel backend. It keeps your main code clean by hiding the messy `fetch` details.

-   **`fetch`**: The standard browser tool for making network requests.
-   **`async/await`**: Allows us to write code that waits for the server to reply without freezing the browser.
-   **`getExpenses`**: Asks the backend for the list of ALL expenses.
-   **`createExpense`**: Sends a POST request to save a new expense.

### 3. `src/components/ExpenseList.tsx`
This component's job is to **display** the data.

-   **Props**: It receives 4 things from its parent (`App.tsx`):
    1.  `expenses`: The list of data to show.
    2.  `onEdit`: A function to call when the user clicks "Edit".
    3.  `onDelete`: A function to call when the user clicks "Delete".
    4.  `onAdd`: A function to call when the user clicks "Add".
-   **Mapping**: `{expenses.map(expense => ...)}` is how we loop through the list and create a table row `<tr>` for every single expense.

### 4. `src/components/ExpenseForm.tsx`
This component handles **user input**.

-   **`useState` for Form Data**: We keep track of the user's input (title, amount, etc.) in a local state variable called `formData`.
-   **`handleChange`**: Every time the user types, this function updates `formData`.
-   **`handleSubmit`**: When the user clicks "Save", this prevents the default page reload and calls the `onSubmit` prop to send the data back to `App`.

### 5. `src/App.tsx` (The Brain 🧠)
This is the main container. It holds the "Truth" (the state) for the application.

-   **State (`expenses`)**: `const [expenses, setExpenses] = useState<Expense[]>([]);`
    -   Here we store the list of expenses. If this list changes, the whole app updates.
-   **State (`view`)**: `const [view, setView] = useState<'list' | 'form'>('list');`
    -   We use this to decide whether to show the *List* or the *Form*.
-   **`useEffect`**:
    -   When the app loads, it immediately calls `loadExpenses()` to fetch data from the Laravel API.
-   **`handleFormSubmit`**:
    -   This function is passed *down* to the `ExpenseForm`. When the form is submitted, this function runs to actually save the data to the server (via `api.ts`) and refresh the list.

### 6. `src/main.tsx`
The entry point. It finds the HTML element with `id="root"` (in `index.html`) and puts the `<App />` component inside it.

---

## 🛠 Flow of Data

1.  **Start**: `App.tsx` loads.
2.  **Fetch**: `useEffect` runs -> calls `api.getExpenses()` -> Backend returns data.
3.  **Render List**: `App` updates `expenses` state -> passes it to `<ExpenseList />`.
4.  **Add/Edit**: 
    -   User clicks "Add" -> `App` changes `view` to `'form'`.
    -   App hides `<ExpenseList />` and shows `<ExpenseForm />`.
5.  **Save**:
    -   User fills form -> Clicks Save.
    -   `ExpenseForm` calls `onSubmit`.
    -   `onSubmit` (in `App`) calls `api.createExpense()`.
    -   `App` refreshes the list and switches back to `'list'` view.
