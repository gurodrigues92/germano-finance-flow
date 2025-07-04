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
      custos_fixos: {
        Row: {
          categoria: string
          created_at: string
          id: string
          mes_referencia: string
          observacoes: string | null
          subcategoria: string
          updated_at: string
          valor: number
        }
        Insert: {
          categoria: string
          created_at?: string
          id?: string
          mes_referencia: string
          observacoes?: string | null
          subcategoria: string
          updated_at?: string
          valor: number
        }
        Update: {
          categoria?: string
          created_at?: string
          id?: string
          mes_referencia?: string
          observacoes?: string | null
          subcategoria?: string
          updated_at?: string
          valor?: number
        }
        Relationships: []
      }
      investimentos: {
        Row: {
          categoria: string
          created_at: string
          data_compra: string
          descricao: string
          fornecedor: string | null
          garantia_meses: number | null
          id: string
          observacoes: string | null
          subcategoria: string
          updated_at: string
          valor: number
        }
        Insert: {
          categoria: string
          created_at?: string
          data_compra: string
          descricao: string
          fornecedor?: string | null
          garantia_meses?: number | null
          id?: string
          observacoes?: string | null
          subcategoria: string
          updated_at?: string
          valor: number
        }
        Update: {
          categoria?: string
          created_at?: string
          data_compra?: string
          descricao?: string
          fornecedor?: string | null
          garantia_meses?: number | null
          id?: string
          observacoes?: string | null
          subcategoria?: string
          updated_at?: string
          valor?: number
        }
        Relationships: []
      }
      metas_financeiras: {
        Row: {
          categoria: string | null
          created_at: string
          data_fim: string
          data_inicio: string
          descricao: string | null
          id: string
          status: string | null
          tipo: string
          titulo: string
          updated_at: string
          valor_atual: number | null
          valor_meta: number
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          data_fim: string
          data_inicio: string
          descricao?: string | null
          id?: string
          status?: string | null
          tipo: string
          titulo: string
          updated_at?: string
          valor_atual?: number | null
          valor_meta: number
        }
        Update: {
          categoria?: string | null
          created_at?: string
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          id?: string
          status?: string | null
          tipo?: string
          titulo?: string
          updated_at?: string
          valor_atual?: number | null
          valor_meta?: number
        }
        Relationships: []
      }
      movimentacao_estoque: {
        Row: {
          created_at: string
          data_movimentacao: string
          fornecedor: string | null
          id: string
          motivo: string | null
          produto_id: string | null
          quantidade: number
          tipo: string
          valor_total: number | null
        }
        Insert: {
          created_at?: string
          data_movimentacao: string
          fornecedor?: string | null
          id?: string
          motivo?: string | null
          produto_id?: string | null
          quantidade: number
          tipo: string
          valor_total?: number | null
        }
        Update: {
          created_at?: string
          data_movimentacao?: string
          fornecedor?: string | null
          id?: string
          motivo?: string | null
          produto_id?: string | null
          quantidade?: number
          tipo?: string
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "movimentacao_estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          categoria: string
          created_at: string
          estoque_atual: number | null
          estoque_minimo: number
          id: string
          nome: string
          unidade_medida: string
          updated_at: string
          valor_unitario: number | null
        }
        Insert: {
          categoria: string
          created_at?: string
          estoque_atual?: number | null
          estoque_minimo: number
          id?: string
          nome: string
          unidade_medida: string
          updated_at?: string
          valor_unitario?: number | null
        }
        Update: {
          categoria?: string
          created_at?: string
          estoque_atual?: number | null
          estoque_minimo?: number
          id?: string
          nome?: string
          unidade_medida?: string
          updated_at?: string
          valor_unitario?: number | null
        }
        Relationships: []
      }
      relatorios_salvos: {
        Row: {
          configuracao: Json
          created_at: string
          data_fim: string | null
          data_inicio: string | null
          id: string
          nome: string
          tipo: string
          updated_at: string
        }
        Insert: {
          configuracao: Json
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          nome: string
          tipo: string
          updated_at?: string
        }
        Update: {
          configuracao?: Json
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      reserva_emergencia: {
        Row: {
          created_at: string
          id: string
          mes_referencia: string
          meta_valor: number
          updated_at: string
          valor_atual: number
        }
        Insert: {
          created_at?: string
          id?: string
          mes_referencia: string
          meta_valor: number
          updated_at?: string
          valor_atual: number
        }
        Update: {
          created_at?: string
          id?: string
          mes_referencia?: string
          meta_valor?: number
          updated_at?: string
          valor_atual?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
