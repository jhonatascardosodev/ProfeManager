import { Loader2 } from 'lucide-react'

type QueryStateProps = {
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  /** Texto do estado de erro, ex.: "Não foi possível carregar as notas." */
  errorMessage: string
}

/** Estado de carregamento/erro de uma lista. Devolve null quando há dados para mostrar. */
export default function QueryState({ isLoading, isError, onRetry, errorMessage }: QueryStateProps) {
  if (isLoading) {
    return (
      <p className="query-state" role="status">
        <Loader2 className="btn-spinner" size={18} aria-hidden /> Carregando…
      </p>
    )
  }

  if (isError) {
    return (
      <div className="query-state query-state--error" role="alert">
        <span>{errorMessage}</span>
        <button type="button" className="btn-secondary" onClick={onRetry}>
          Tentar novamente
        </button>
      </div>
    )
  }

  return null
}
