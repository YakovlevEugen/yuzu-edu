export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      configs: {
        Row: {
          key: string
          scope: string
          value: Json | null
        }
        Insert: {
          key: string
          scope: string
          value?: Json | null
        }
        Update: {
          key?: string
          scope?: string
          value?: Json | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          address: string
          block: number
          createdAt: string
          details: Json
          id: string
          transactionId: string
          type: string
          value: number
        }
        Insert: {
          address: string
          block: number
          createdAt: string
          details: Json
          id?: string
          transactionId: string
          type: string
          value: number
        }
        Update: {
          address?: string
          block?: number
          createdAt?: string
          details?: Json
          id?: string
          transactionId?: string
          type?: string
          value?: number
        }
        Relationships: []
      }
      wedu_balance_changes: {
        Row: {
          address: string
          amount: number
          blockNumber: number
          blockTimestamp: string
          chain: string
          logIndex: number
          transactionHash: string
          transactionIndex: string
        }
        Insert: {
          address: string
          amount: number
          blockNumber: number
          blockTimestamp: string
          chain: string
          logIndex: number
          transactionHash: string
          transactionIndex: string
        }
        Update: {
          address?: string
          amount?: number
          blockNumber?: number
          blockTimestamp?: string
          chain?: string
          logIndex?: number
          transactionHash?: string
          transactionIndex?: string
        }
        Relationships: []
      }
    }
    Views: {
      wedu_agg_point_balances_view: {
        Row: {
          address: string | null
          points: number | null
          timestamp: string | null
        }
        Relationships: []
      }
      wedu_balances_changes_view: {
        Row: {
          address: string | null
          amount: number | null
          balance: number | null
          blockNumber: number | null
          blockTimestamp: string | null
          chain: string | null
          logIndex: number | null
          rowNumber: number | null
          transactionHash: string | null
          transactionIndex: string | null
          untilBlockTimestamp: string | null
        }
        Relationships: []
      }
      wedu_point_balances_view: {
        Row: {
          address: string | null
          amount: number | null
          balance: number | null
          blockNumber: number | null
          blockTimestamp: string | null
          chain: string | null
          logIndex: number | null
          points: number | null
          rowNumber: number | null
          transactionHash: string | null
          transactionIndex: string | null
          untilBlockTimestamp: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
