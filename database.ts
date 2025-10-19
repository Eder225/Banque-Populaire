// database.ts

export interface Account {
  name: string;
  balance: number;
  iban?: string;
}

export interface Transaction {
  id?: string;
  description: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  details?: {
    reason: string;
    recipientName: string;
    recipientIban: string;
    senderName: string;
    senderIban: string;
    recipientEmail?: string;
  }
}

export interface Card {
  id: string;
  type: 'Visa Premier' | 'Mastercard Gold';
  number: string;
  expiry: string;
  holderName: string;
  limits: {
    payment: {
      current: number;
      max: number;
    };
    withdrawal: {
      current: number;
      max: number;
    };
  };
  contactless: boolean;
  onlinePayment: boolean;
  foreignPayment: boolean;
  pin?: string;
}

export interface User {
  id: string; // login identifier
  secretCode: string;
  name: string;
  accounts: {
    courant: Account;
    livretA: Account;
  };
  cards: Card[];
  transactions: Transaction[];
}

const DEFAULT_USER_DATA: User = {
  id: '2812199920',
  secretCode: '668877',
  name: 'Philip Leroux',
  accounts: {
    courant: { name: 'Compte Courant', balance: 2560545.22, iban: 'FR76 1020 7001 2345 6789 0123 456' },
    livretA: { name: 'Livret A', balance: 12050.21, iban: 'FR76 1020 7001 9876 5432 1098 765' },
  },
  cards: [
    {
      id: 'card-1',
      type: 'Visa Premier',
      number: '4978 **** **** 8821',
      expiry: '12/26',
      holderName: 'Philip Leroux',
      pin: '1234',
      limits: {
        payment: { current: 3000, max: 5000 },
        withdrawal: { current: 1000, max: 2000 },
      },
      contactless: true,
      onlinePayment: true,
      foreignPayment: false,
    },
    {
      id: 'card-2',
      type: 'Mastercard Gold',
      number: '5578 **** **** 1234',
      expiry: '08/25',
      holderName: 'Philip Leroux',
      pin: '5678',
      limits: {
        payment: { current: 5000, max: 10000 },
        withdrawal: { current: 2000, max: 3000 },
      },
      contactless: true,
      onlinePayment: true,
      foreignPayment: true,
    }
  ],
  transactions: [
    { id: "tx-default-1", description: "Achat en ligne Amazon", date: "25/07/2024", amount: -49.99, type: 'debit' },
    { id: "tx-default-2", description: "Virement entrant - Salaire", date: "25/07/2024", amount: 2150.00, type: 'credit' },
    { id: "tx-default-3", description: "Prélèvement Spotify", date: "24/07/2024", amount: -10.99, type: 'debit' },
    { id: "tx-default-4", description: "Restaurant 'Le Gourmet'", date: "22/07/2024", amount: -85.50, type: 'debit' },
    { id: "tx-default-5", description: "Remboursement ami", date: "21/07/2024", amount: 30.00, type: 'credit' },
    { id: "tx-default-6", description: "Courses alimentaires", date: "20/07/2024", amount: -124.30, type: 'debit' },
  ],
};

const DB_KEY = 'banquePopulaireUserData';

// Function to get user data from localStorage or return default
export const getUserData = (): User => {
  try {
    const storedDataString = localStorage.getItem(DB_KEY);
    if (storedDataString) {
      const storedData = JSON.parse(storedDataString);
      
      // Deep merge stored data on top of defaults to ensure new fields are added
      // while preserving user's existing data like balance and transactions.
      const mergedData: User = {
        ...DEFAULT_USER_DATA,
        ...storedData,
        accounts: {
          ...DEFAULT_USER_DATA.accounts,
          courant: {
            ...DEFAULT_USER_DATA.accounts.courant,
            ...((storedData.accounts || {}).courant || {}),
          },
          livretA: {
            ...DEFAULT_USER_DATA.accounts.livretA,
            ...((storedData.accounts || {}).livretA || {}),
          },
        },
        // Arrays from stored data should completely replace default arrays.
        cards: storedData.cards || DEFAULT_USER_DATA.cards,
        transactions: storedData.transactions || DEFAULT_USER_DATA.transactions,
      };

      return mergedData;

    } else {
      // If no data, set default data in localStorage and return it
      localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_USER_DATA));
      return DEFAULT_USER_DATA;
    }
  } catch (error) {
    console.error("Failed to retrieve or parse user data, resetting to default:", error);
     // If parsing fails or any other error, reset to default to avoid app crash
    localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_USER_DATA));
    return DEFAULT_USER_DATA;
  }
};

// Function to update user data in localStorage
export const updateUserData = (newUserData: User): void => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(newUserData));
  } catch (error) {
    console.error("Failed to save user data:", error);
  }
};