import { useEffect, useState, type FormEvent } from 'react'
import {
  Bot,
  MessageSquareText,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { AppSidebar } from '@/components/AppSidebar'
import { ApiError } from '@/shared/api/apiClient'
import { leadsApi } from '@/features/leads/api/leadsApi'
import type { LeadStage } from '@/features/leads/types'
import {
  automationsApi,
  type AutomationRule,
  type MessageTemplate,
} from './automationsApi'
import './automations.css'

export function AutomationsPage({ onLogout }: { onLogout: () => void }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [stages, setStages] = useState<LeadStage[]>([])
  const [templateOpen, setTemplateOpen] = useState(false)
  const [ruleOpen, setRuleOpen] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [ruleName, setRuleName] = useState('')
  const [content, setContent] = useState('')
  const [trigger, setTrigger] = useState('LEAD_CREATED')
  const [action, setAction] = useState('CREATE_TASK')
  const [stageId, setStageId] = useState('')
  const [delay, setDelay] = useState(1440)
  const [error, setError] = useState('')

  const load = () =>
    Promise.all([
      automationsApi.templates(),
      automationsApi.rules(),
      leadsApi.stages(),
    ])
      .then(([templateResult, ruleResult, stageResult]) => {
        setTemplates(
          templateResult.templates.filter(
            (template) => template.channel === 'WHATSAPP',
          ),
        )
        setRules(ruleResult.rules)
        setStages(stageResult.stages)
        setError('')
      })
      .catch((caught) =>
        setError(
          caught instanceof ApiError
            ? caught.message
            : 'Não foi possível carregar as automações.',
        ),
      )

  useEffect(() => {
    void load()
  }, [])

  const createTemplate = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const { template } = await automationsApi.createTemplate({
        name: templateName,
        channel: 'WHATSAPP',
        content,
      })
      setTemplates((items) => [...items, template])
      setTemplateName('')
      setContent('')
      setTemplateOpen(false)
      setError('')
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Não foi possível criar o modelo.',
      )
    }
  }

  const createRule = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const { rule } = await automationsApi.createRule({
        name: ruleName,
        trigger,
        action,
        stageId:
          trigger === 'STAGE_CHANGED' && stageId ? stageId : undefined,
        delayMinutes: action === 'CREATE_TASK' ? delay : 0,
        enabled: false,
      })
      setRules((items) => [rule, ...items])
      setRuleName('')
      setRuleOpen(false)
      setError('')
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Não foi possível criar a regra.',
      )
    }
  }

  const toggle = async (rule: AutomationRule) => {
    try {
      const { rule: updated } = await automationsApi.updateRule(rule.id, {
        enabled: !rule.enabled,
      })
      setRules((items) =>
        items.map((item) => (item.id === rule.id ? updated : item)),
      )
      setError('')
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Não foi possível atualizar a regra.',
      )
    }
  }

  const removeTemplate = async (template: MessageTemplate) => {
    try {
      await automationsApi.removeTemplate(template.id)
      setTemplates((items) =>
        items.filter((item) => item.id !== template.id),
      )
      setError('')
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Não foi possível excluir o modelo.',
      )
    }
  }

  const removeRule = async (rule: AutomationRule) => {
    try {
      await automationsApi.removeRule(rule.id)
      setRules((items) => items.filter((item) => item.id !== rule.id))
      setError('')
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Não foi possível excluir a regra.',
      )
    }
  }

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCollapse={() => setCollapsed((value) => !value)}
        onMobileClose={() => setMobileOpen(false)}
        onUserMenu={() => setUserMenu((value) => !value)}
        userMenuOpen={userMenu}
        onLogout={onLogout}
      />
      <main className="automations-main">
        <header className="page-header">
          <div>
            <span className="eyebrow">PRODUTIVIDADE</span>
            <h1>Automações</h1>
            <p>Respostas rápidas e regras para não perder follow-ups.</p>
          </div>
          <span className="safe-automation">
            <ShieldCheck size={15} />
            Regras desativadas por padrão
          </span>
        </header>

        <div className="automation-content">
          {error && (
            <div className="inline-error">
              {error}
              <button onClick={() => setError('')} aria-label="Fechar aviso">
                ×
              </button>
            </div>
          )}

          <section className="automation-grid">
            <div className="panel automation-panel">
              <header>
                <div>
                  <span className="automation-panel-icon">
                    <MessageSquareText size={18} />
                  </span>
                  <span>
                    <strong>Respostas rápidas</strong>
                    <small>Modelos do WhatsApp para usar nas conversas.</small>
                  </span>
                </div>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setTemplateName('')
                    setTemplateOpen((value) => !value)
                  }}
                >
                  <Plus size={14} />
                  Novo modelo
                </button>
              </header>

              {templateOpen && (
                <form
                  className="inline-automation-form template-form"
                  onSubmit={(event) => void createTemplate(event)}
                >
                  <label>
                    Nome do modelo
                    <input
                      required
                      value={templateName}
                      onChange={(event) => setTemplateName(event.target.value)}
                      placeholder="Ex.: Primeiro atendimento"
                    />
                  </label>
                  <label>
                    Mensagem
                    <textarea
                      required
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      rows={4}
                      placeholder="Olá, {{nome}}! Como posso ajudar?"
                    />
                  </label>
                  <div className="automation-form-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setTemplateOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button className="primary-button">Salvar modelo</button>
                  </div>
                </form>
              )}

              <div className="automation-list">
                {templates.map((template) => (
                  <article key={template.id}>
                    <span className="automation-item-icon">
                      <MessageSquareText size={16} />
                    </span>
                    <div>
                      <strong>{template.name}</strong>
                      <p>{template.content}</p>
                    </div>
                    <button
                      type="button"
                      className="automation-delete"
                      onClick={() => void removeTemplate(template)}
                      aria-label={`Excluir modelo ${template.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </article>
                ))}
                {templates.length === 0 && (
                  <div className="automation-empty">
                    <MessageSquareText size={23} />
                    <strong>Nenhuma resposta rápida</strong>
                    <p>Crie textos reutilizáveis para responder pelo WhatsApp.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="panel automation-panel">
              <header>
                <div>
                  <span className="automation-panel-icon">
                    <Bot size={18} />
                  </span>
                  <span>
                    <strong>Regras automáticas</strong>
                    <small>Follow-ups e distribuição dos seus leads.</small>
                  </span>
                </div>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setRuleName('')
                    setRuleOpen((value) => !value)
                  }}
                >
                  <Plus size={14} />
                  Nova regra
                </button>
              </header>

              {ruleOpen && (
                <form
                  className="inline-automation-form rule-form"
                  onSubmit={(event) => void createRule(event)}
                >
                  <label className="automation-field-wide">
                    Nome da regra
                    <input
                      required
                      value={ruleName}
                      onChange={(event) => setRuleName(event.target.value)}
                      placeholder="Ex.: Retorno após novo lead"
                    />
                  </label>
                  <label>
                    Quando
                    <select
                      value={trigger}
                      onChange={(event) => setTrigger(event.target.value)}
                    >
                      <option value="LEAD_CREATED">Um lead for criado</option>
                      <option value="STAGE_CHANGED">Mudar de etapa</option>
                    </select>
                  </label>
                  <label>
                    Ação
                    <select
                      value={action}
                      onChange={(event) => setAction(event.target.value)}
                    >
                      <option value="CREATE_TASK">Criar tarefa de follow-up</option>
                      <option value="ASSIGN_LEAD">Distribuir lead</option>
                    </select>
                  </label>
                  {trigger === 'STAGE_CHANGED' && (
                    <label>
                      Etapa
                      <select
                        required
                        value={stageId}
                        onChange={(event) => setStageId(event.target.value)}
                      >
                        <option value="">Escolha a etapa</option>
                        {stages.map((stage) => (
                          <option key={stage.id} value={stage.id}>
                            {stage.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  {action === 'CREATE_TASK' && (
                    <label>
                      Executar após (minutos)
                      <input
                        type="number"
                        min="0"
                        max="43200"
                        value={delay}
                        onChange={(event) => setDelay(Number(event.target.value))}
                      />
                    </label>
                  )}
                  <div className="automation-form-actions automation-field-wide">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setRuleOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button className="primary-button">Criar desativada</button>
                  </div>
                </form>
              )}

              <div className="automation-list">
                {rules.map((rule) => (
                  <article key={rule.id}>
                    <button
                      type="button"
                      className={`rule-switch ${rule.enabled ? 'on' : ''}`}
                      onClick={() => void toggle(rule)}
                      aria-label={
                        rule.enabled
                          ? `Desativar regra ${rule.name}`
                          : `Ativar regra ${rule.name}`
                      }
                      aria-pressed={rule.enabled}
                    >
                      <span />
                    </button>
                    <div>
                      <strong>{rule.name}</strong>
                      <p>
                        {rule.trigger === 'LEAD_CREATED'
                          ? 'Lead criado'
                          : 'Mudança de etapa'}{' '}
                        →{' '}
                        {rule.action === 'CREATE_TASK'
                          ? `follow-up em ${rule.delayMinutes} min`
                          : 'distribuir lead'}
                      </p>
                    </div>
                    <span
                      className={`automation-status ${
                        rule.enabled ? 'enabled' : ''
                      }`}
                    >
                      {rule.enabled ? 'Ativa' : 'Inativa'}
                    </span>
                    <button
                      type="button"
                      className="automation-delete"
                      onClick={() => void removeRule(rule)}
                      aria-label={`Excluir regra ${rule.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </article>
                ))}
                {rules.length === 0 && (
                  <div className="automation-empty">
                    <Bot size={23} />
                    <strong>Nenhuma regra automática</strong>
                    <p>As regras só executam depois que você as ativar.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
