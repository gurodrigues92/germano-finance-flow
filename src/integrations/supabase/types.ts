export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          cliente_id: string
          created_at: string
          data: string
          hora_fim: string
          hora_inicio: string
          id: string
          observacoes: string | null
          profissional_id: string
          servico_id: string
          status: string
          updated_at: string
          user_id: string | null
          valor: number
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data: string
          hora_fim: string
          hora_inicio: string
          id?: string
          observacoes?: string | null
          profissional_id: string
          servico_id: string
          status?: string
          updated_at?: string
          user_id?: string | null
          valor: number
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data?: string
          hora_fim?: string
          hora_inicio?: string
          id?: string
          observacoes?: string | null
          profissional_id?: string
          servico_id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      bloqueios_agenda: {
        Row: {
          cor: string | null
          created_at: string
          data: string
          hora_fim: string
          hora_inicio: string
          id: string
          motivo: string | null
          profissional_id: string
          tipo: string
          user_id: string | null
        }
        Insert: {
          cor?: string | null
          created_at?: string
          data: string
          hora_fim: string
          hora_inicio: string
          id?: string
          motivo?: string | null
          profissional_id: string
          tipo: string
          user_id?: string | null
        }
        Update: {
          cor?: string | null
          created_at?: string
          data?: string
          hora_fim?: string
          hora_inicio?: string
          id?: string
          motivo?: string | null
          profissional_id?: string
          tipo?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bloqueios_agenda_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          ativo: boolean
          created_at: string
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          foto_url: string | null
          id: string
          nome: string
          observacoes: string | null
          saldo: number
          telefone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          saldo?: number
          telefone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          saldo?: number
          telefone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      comanda_itens: {
        Row: {
          comanda_id: string
          created_at: string
          id: string
          item_id: string
          nome_item: string
          profissional_id: string | null
          quantidade: number
          tipo: string
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          comanda_id: string
          created_at?: string
          id?: string
          item_id: string
          nome_item: string
          profissional_id?: string | null
          quantidade?: number
          tipo: string
          valor_total: number
          valor_unitario: number
        }
        Update: {
          comanda_id?: string
          created_at?: string
          id?: string
          item_id?: string
          nome_item?: string
          profissional_id?: string | null
          quantidade?: number
          tipo?: string
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "comanda_itens_comanda_id_fkey"
            columns: ["comanda_id"]
            isOneToOne: false
            referencedRelation: "comandas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comanda_itens_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
        ]
      }
      comandas: {
        Row: {
          cliente_id: string | null
          created_at: string
          credito: number
          data_abertura: string
          data_fechamento: string | null
          debito: number
          desconto: number
          dinheiro: number
          id: string
          numero_comanda: number
          observacoes: string | null
          pix: number
          profissional_principal_id: string | null
          status: string
          total_bruto: number
          total_liquido: number
          transacao_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          credito?: number
          data_abertura?: string
          data_fechamento?: string | null
          debito?: number
          desconto?: number
          dinheiro?: number
          id?: string
          numero_comanda?: number
          observacoes?: string | null
          pix?: number
          profissional_principal_id?: string | null
          status?: string
          total_bruto?: number
          total_liquido?: number
          transacao_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          credito?: number
          data_abertura?: string
          data_fechamento?: string | null
          debito?: number
          desconto?: number
          dinheiro?: number
          id?: string
          numero_comanda?: number
          observacoes?: string | null
          pix?: number
          profissional_principal_id?: string | null
          status?: string
          total_bruto?: number
          total_liquido?: number
          transacao_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comandas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comandas_profissional_principal_id_fkey"
            columns: ["profissional_principal_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comandas_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      custos_fixos: {
        Row: {
          categoria: string
          created_at: string
          id: string
          mes_referencia: string
          observacoes: string | null
          subcategoria: string
          updated_at: string
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
          valor_unitario?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profissionais: {
        Row: {
          ativo: boolean
          cor_agenda: string | null
          created_at: string
          email: string | null
          foto_url: string | null
          horario_trabalho: Json | null
          id: string
          nome: string
          percentual_comissao: number
          telefone: string | null
          tipo: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ativo?: boolean
          cor_agenda?: string | null
          created_at?: string
          email?: string | null
          foto_url?: string | null
          horario_trabalho?: Json | null
          id?: string
          nome: string
          percentual_comissao?: number
          telefone?: string | null
          tipo: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ativo?: boolean
          cor_agenda?: string | null
          created_at?: string
          email?: string | null
          foto_url?: string | null
          horario_trabalho?: Json | null
          id?: string
          nome?: string
          percentual_comissao?: number
          telefone?: string | null
          tipo?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profissional_servicos: {
        Row: {
          created_at: string
          id: string
          profissional_id: string
          servico_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profissional_id: string
          servico_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profissional_id?: string
          servico_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profissional_servicos_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profissional_servicos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          user_id: string | null
          valor_atual: number
        }
        Insert: {
          created_at?: string
          id?: string
          mes_referencia: string
          meta_valor: number
          updated_at?: string
          user_id?: string | null
          valor_atual: number
        }
        Update: {
          created_at?: string
          id?: string
          mes_referencia?: string
          meta_valor?: number
          updated_at?: string
          user_id?: string | null
          valor_atual?: number
        }
        Relationships: []
      }
      servicos: {
        Row: {
          ativo: boolean
          categoria: string
          cor_categoria: string | null
          created_at: string
          descricao: string | null
          duracao_minutos: number
          id: string
          nome: string
          preco: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ativo?: boolean
          categoria: string
          cor_categoria?: string | null
          created_at?: string
          descricao?: string | null
          duracao_minutos?: number
          id?: string
          nome: string
          preco: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ativo?: boolean
          categoria?: string
          cor_categoria?: string | null
          created_at?: string
          descricao?: string | null
          duracao_minutos?: number
          id?: string
          nome?: string
          preco?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      transacoes: {
        Row: {
          ano: number
          assistente_taxa: number | null
          created_at: string
          credito: number
          custom_rates: Json | null
          data: string
          debito: number
          dinheiro: number
          edu_share: number
          id: string
          kam_share: number
          mes_referencia: string
          pix: number
          profissional_id: string | null
          studio_share: number
          taxa_credito: number
          taxa_debito: number
          tem_assistente: boolean | null
          total_bruto: number
          total_liquido: number
          updated_at: string
        }
        Insert: {
          ano: number
          assistente_taxa?: number | null
          created_at?: string
          credito?: number
          custom_rates?: Json | null
          data: string
          debito?: number
          dinheiro?: number
          edu_share: number
          id?: string
          kam_share: number
          mes_referencia: string
          pix?: number
          profissional_id?: string | null
          studio_share: number
          taxa_credito?: number
          taxa_debito?: number
          tem_assistente?: boolean | null
          total_bruto: number
          total_liquido: number
          updated_at?: string
        }
        Update: {
          ano?: number
          assistente_taxa?: number | null
          created_at?: string
          credito?: number
          custom_rates?: Json | null
          data?: string
          debito?: number
          dinheiro?: number
          edu_share?: number
          id?: string
          kam_share?: number
          mes_referencia?: string
          pix?: number
          profissional_id?: string | null
          studio_share?: number
          taxa_credito?: number
          taxa_debito?: number
          tem_assistente?: boolean | null
          total_bruto?: number
          total_liquido?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "assistente"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "assistente"],
    },
  },
} as const
