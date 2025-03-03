export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      community_rewards_history: {
        Row: {
          address: string;
          community: string;
          createdAt: string;
          points: number;
        };
        Insert: {
          address: string;
          community: string;
          createdAt?: string;
          points?: number;
        };
        Update: {
          address?: string;
          community?: string;
          createdAt?: string;
          points?: number;
        };
        Relationships: [];
      };
      configs: {
        Row: {
          key: string;
          scope: string;
          value: Json | null;
        };
        Insert: {
          key: string;
          scope: string;
          value?: Json | null;
        };
        Update: {
          key?: string;
          scope?: string;
          value?: Json | null;
        };
        Relationships: [];
      };
      faucet_wallets: {
        Row: {
          address: string;
          createdAt: string;
        };
        Insert: {
          address: string;
          createdAt?: string;
        };
        Update: {
          address?: string;
          createdAt?: string;
        };
        Relationships: [];
      };
      testnet_points: {
        Row: {
          address: string;
          points: number;
        };
        Insert: {
          address: string;
          points?: number;
        };
        Update: {
          address?: string;
          points?: number;
        };
        Relationships: [];
      };
      wedu_balance_changes: {
        Row: {
          address: string;
          amount: number;
          blockNumber: number;
          blockTimestamp: string;
          chain: string;
          logIndex: number;
          transactionHash: string;
          transactionIndex: string;
        };
        Insert: {
          address: string;
          amount: number;
          blockNumber: number;
          blockTimestamp: string;
          chain: string;
          logIndex: number;
          transactionHash: string;
          transactionIndex: string;
        };
        Update: {
          address?: string;
          amount?: number;
          blockNumber?: number;
          blockTimestamp?: string;
          chain?: string;
          logIndex?: number;
          transactionHash?: string;
          transactionIndex?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      community_rewards_by_address: {
        Row: {
          address: string | null;
          total: number | null;
        };
        Relationships: [];
      };
      community_rewards_by_community: {
        Row: {
          community: string | null;
          total: number | null;
        };
        Relationships: [];
      };
      wedu_agg_point_balances_view: {
        Row: {
          address: string | null;
          chain: string | null;
          points: number | null;
          timestamp: string | null;
        };
        Relationships: [];
      };
      wedu_balances_changes_view: {
        Row: {
          address: string | null;
          amount: number | null;
          balance: number | null;
          blockNumber: number | null;
          blockTimestamp: string | null;
          chain: string | null;
          logIndex: number | null;
          rowNumber: number | null;
          transactionHash: string | null;
          transactionIndex: string | null;
          untilBlockTimestamp: string | null;
        };
        Relationships: [];
      };
      wedu_point_balances_view: {
        Row: {
          address: string | null;
          amount: number | null;
          balance: number | null;
          blockNumber: number | null;
          blockTimestamp: string | null;
          chain: string | null;
          logIndex: number | null;
          points: number | null;
          rowNumber: number | null;
          transactionHash: string | null;
          transactionIndex: string | null;
          untilBlockTimestamp: string | null;
        };
        Relationships: [];
      };
      weth_point_reservations: {
        Row: {
          address: string | null;
          chain: string | null;
          points: number | null;
          reason: string | null;
          timestamp: string | null;
        };
        Relationships: [];
      };
      yuzu_snapshot: {
        Row: {
          address: string | null;
          chain: string | null;
          points: number | null;
          timestamp: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      reset_community_allocations: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      reset_community_rewards: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      reset_faucet_wallets: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      reset_testnet_points: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
