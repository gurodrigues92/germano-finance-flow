// Sistema de auditoria para transações financeiras
interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'TRANSACTION';
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ip?: string;
  userAgent?: string;
}

class AuditLogger {
  private static instance: AuditLogger;
  private entries: AuditEntry[] = [];

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  async log(entry: Omit<AuditEntry, 'id' | 'timestamp'>) {
    const auditEntry: AuditEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };

    this.entries.push(auditEntry);
    
    // Log no console para debugging
    console.log('[AUDIT]', auditEntry);
    
    // Em produção, seria enviado para um serviço de auditoria separado
    try {
      // Salvar no localStorage temporariamente
      const existing = JSON.parse(localStorage.getItem('audit_log') || '[]');
      existing.push(auditEntry);
      
      // Manter apenas os últimos 1000 entries
      if (existing.length > 1000) {
        existing.splice(0, existing.length - 1000);
      }
      
      localStorage.setItem('audit_log', JSON.stringify(existing));
    } catch (error) {
      console.error('[AUDIT] Erro ao salvar log:', error);
    }
  }

  getAuditTrail(entityId?: string): AuditEntry[] {
    try {
      const entries = JSON.parse(localStorage.getItem('audit_log') || '[]');
      return entityId 
        ? entries.filter((e: AuditEntry) => e.entityId === entityId)
        : entries;
    } catch {
      return [];
    }
  }

  async logTransaction(action: 'CREATE' | 'UPDATE' | 'DELETE', transactionId: string, oldValue?: any, newValue?: any, userId?: string) {
    await this.log({
      userId: userId || 'unknown',
      action,
      entityType: 'TRANSACTION',
      entityId: transactionId,
      oldValue,
      newValue
    });
  }
}

export const auditLogger = AuditLogger.getInstance();