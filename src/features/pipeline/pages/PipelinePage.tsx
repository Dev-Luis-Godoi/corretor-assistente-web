import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  Plus,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ApiError } from "@/shared/api/apiClient";
import { leadsApi } from "@/features/leads/api/leadsApi";
import { LeadKanbanBoard } from "@/features/leads/components/LeadKanbanBoard";
import { LeadDrawer } from "@/features/leads/components/LeadDrawer";
import { LeadFormModal } from "@/features/leads/components/LeadFormModal";
import { LeadTable } from "@/features/leads/components/LeadTable";
import {
  ViewToggle,
  type LeadViewMode,
} from "@/features/leads/components/ViewToggle";
import type { Lead, LeadStage } from "@/features/leads/types";
import { getDefaultCommercialView } from "@/features/account/preferences";
import { pipelineApi } from "../api/pipelineApi";
import "../pipeline.css";

const colors = [
  "#2563EB",
  "#3B82F6",
  "#F59E0B",
  "#8B5CF6",
  "#EF4444",
  "#64748B",
];

export function PipelinePage({ onLogout }: { onLogout: () => void }) {
  const [params, setParams] = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stages, setStages] = useState<LeadStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<LeadViewMode>(getDefaultCommercialView);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [managingStages, setManagingStages] = useState(false);
  const [creatingLead, setCreatingLead] = useState(false);
  const [stageName, setStageName] = useState("");
  const [stageColor, setStageColor] = useState(colors[0]);
  const [refresh, setRefresh] = useState(0);
  const selectedLeadId = params.get("lead");

  useEffect(() => {
    let active = true;
    Promise.all([
      leadsApi.list({ page: 1, limit: 100 }),
      leadsApi.stages(),
    ])
      .then(([leadResult, stageResult]) => {
        if (!active) return;
        setLeads(leadResult.data);
        setStages(stageResult.stages);
        setError("");
      })
      .catch((caught) => {
        if (active) {
          setError(
            caught instanceof ApiError
              ? caught.message
              : "Não foi possível carregar o pipeline.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refresh]);

  useEffect(() => {
    if (!managingStages) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setManagingStages(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [managingStages]);

  const moveLead = async (leadId: string, stageId: string) => {
    const current = leads.find((item) => item.id === leadId);
    const stage = stages.find((item) => item.id === stageId);
    if (!current || !stage || current.stage.id === stageId) return;

    const snapshot = leads;
    setMovingId(leadId);
    setLeads((items) =>
      items.map((item) =>
        item.id === leadId ? { ...item, stage } : item,
      ),
    );
    try {
      const { lead } = await leadsApi.updateStage(leadId, stageId);
      setLeads((items) =>
        items.map((item) => (item.id === leadId ? lead : item)),
      );
    } catch (caught) {
      setLeads(snapshot);
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Não foi possível mover o lead.",
      );
    } finally {
      setMovingId(null);
    }
  };

  const createStage = async (event: FormEvent) => {
    event.preventDefault();
    if (stageName.trim().length < 2) return;
    setError("");
    try {
      const { stage } = await pipelineApi.create(
        stageName.trim(),
        stageColor,
      );
      setStages((items) => [...items, stage]);
      setStageName("");
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Não foi possível criar a etapa.",
      );
    }
  };

  const renameStage = async (stage: LeadStage) => {
    const name = window.prompt("Novo nome da etapa", stage.name)?.trim();
    if (!name || name === stage.name) return;
    setError("");
    try {
      const { stage: updated } = await pipelineApi.update(stage.id, { name });
      setStages((items) =>
        items.map((item) => (item.id === stage.id ? updated : item)),
      );
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Não foi possível renomear a etapa.",
      );
    }
  };

  const removeStage = async (stage: LeadStage) => {
    if (!window.confirm(`Excluir a etapa “${stage.name}”?`)) return;
    setError("");
    try {
      await pipelineApi.remove(stage.id);
      setStages((items) => items.filter((item) => item.id !== stage.id));
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "A etapa não pode ser excluída.",
      );
    }
  };

  const reorder = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= stages.length) return;
    const next = [...stages];
    [next[index], next[target]] = [next[target], next[index]];
    setStages(next);
    setError("");
    try {
      const { stages: updated } = await pipelineApi.reorder(
        next.map((stage) => stage.id),
      );
      setStages(updated);
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Não foi possível reordenar as etapas.",
      );
      setRefresh((value) => value + 1);
    }
  };

  return (
    <div
      className={`app-shell pipeline-page ${collapsed ? "sidebar-collapsed" : ""}`}
    >
      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCollapse={() => setCollapsed((value) => !value)}
        onMobileClose={() => setMobileOpen((value) => !value)}
        onUserMenu={() => setUserMenu((value) => !value)}
        userMenuOpen={userMenu}
        onLogout={onLogout}
      />
      <main className="pipeline-main">
        <header className="page-header">
          <div>
            <span className="eyebrow">PROCESSO COMERCIAL</span>
            <h1>Pipeline</h1>
            <p>Acompanhe o avanço de todas as oportunidades.</p>
          </div>
          <div className="page-actions">
            <ViewToggle value={view} onChange={setView} />
            <button
              type="button"
              className="secondary-button pipeline-stage-button"
              onClick={() => {
                setError("");
                setManagingStages(true);
              }}
            >
              <Settings2 size={17} />
              <span>Etapas do funil</span>
            </button>
            <button
              type="button"
              className="primary-button"
              disabled={loading || stages.length === 0}
              onClick={() => setCreatingLead(true)}
            >
              <Plus size={17} />
              Novo lead
            </button>
          </div>
        </header>

        <div className="pipeline-content">
          {error && !managingStages && (
            <div className="inline-error pipeline-error">
              {error}
              <button onClick={() => setError("")}>×</button>
            </div>
          )}
          <section className="panel pipeline-workspace">
            {loading ? (
              <div className="lead-skeleton">
                {Array.from({ length: 5 }, (_, index) => (
                  <span key={index} />
                ))}
              </div>
            ) : view === "kanban" ? (
              <LeadKanbanBoard
                leads={leads}
                stages={stages}
                movingId={movingId}
                onMove={(leadId, stageId) => void moveLead(leadId, stageId)}
                onOpen={(leadId) => setParams({ lead: leadId })}
              />
            ) : (
              <LeadTable
                leads={leads}
                onOpen={(leadId) => setParams({ lead: leadId })}
              />
            )}
          </section>
        </div>
      </main>

      {managingStages && (
        <div
          className="overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setManagingStages(false);
          }}
        >
          <section
            className="modal pipeline-stage-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pipeline-stage-modal-title"
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">CONFIGURAÇÃO DO FUNIL</span>
                <h2 id="pipeline-stage-modal-title">Etapas do funil</h2>
                <p>Crie, renomeie e organize as colunas da sua pipeline.</p>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setManagingStages(false)}
                aria-label="Fechar gerenciamento de etapas"
              >
                <X size={19} />
              </button>
            </div>

            <div className="pipeline-stage-modal-body">
              <form
                className="pipeline-stage-create"
                onSubmit={(event) => void createStage(event)}
              >
                <label>
                  Nova etapa
                  <input
                    autoFocus
                    value={stageName}
                    onChange={(event) => setStageName(event.target.value)}
                    placeholder="Ex.: Proposta enviada"
                  />
                </label>
                <label className="pipeline-color-field">
                  Cor
                  <input
                    type="color"
                    value={stageColor}
                    onChange={(event) => setStageColor(event.target.value)}
                    aria-label="Cor da nova etapa"
                  />
                </label>
                <button
                  className="primary-button"
                  disabled={stageName.trim().length < 2}
                >
                  <Plus size={16} /> Adicionar
                </button>
              </form>

              {error && (
                <div className="inline-error pipeline-modal-error">
                  {error}
                  <button onClick={() => setError("")}>×</button>
                </div>
              )}

              <div className="pipeline-stage-list">
                {stages.map((stage, index) => (
                  <article key={stage.id}>
                    <i style={{ background: stage.color }} />
                    <button
                      type="button"
                      className="pipeline-stage-name"
                      onClick={() => void renameStage(stage)}
                      title="Renomear etapa"
                    >
                      <strong>{stage.name}</strong>
                      <span>
                        {leads.filter((lead) => lead.stage.id === stage.id).length}{" "}
                        leads
                      </span>
                    </button>
                    <div className="pipeline-stage-actions">
                      <button
                        type="button"
                        onClick={() => void reorder(index, -1)}
                        disabled={index === 0}
                        aria-label="Mover etapa para cima"
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void reorder(index, 1)}
                        disabled={index === stages.length - 1}
                        aria-label="Mover etapa para baixo"
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        type="button"
                        className="pipeline-stage-delete"
                        onClick={() => void removeStage(stage)}
                        aria-label={`Excluir ${stage.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </article>
                ))}
                {stages.length === 0 && (
                  <div className="pipeline-stage-empty">
                    Crie a primeira etapa para começar seu funil.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      <LeadFormModal
        open={creatingLead}
        stages={stages}
        onClose={() => setCreatingLead(false)}
        onCreated={(lead) => {
          setLeads((items) => [lead, ...items]);
          setCreatingLead(false);
          setParams({ lead: lead.id });
        }}
      />
      <LeadDrawer
        leadId={selectedLeadId}
        onClose={() => setParams({})}
        onChanged={(updated) =>
          setLeads((items) =>
            items.map((item) => (item.id === updated.id ? updated : item)),
          )
        }
      />
    </div>
  );
}
