import { Clipboard } from "lucide-react";

export function ServiceList() {
	return (
		<main className="flex flex-1 flex-col overflow-hidden rounded-lg bg-card">
			<div className="border-b px-4 py-3">
				<span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
					Lista de Servicio
				</span>
			</div>

			<div className="flex flex-1 flex-col items-center justify-center gap-2">
				<div className="flex size-16 items-center justify-center rounded-xl bg-muted/60">
					<Clipboard className="size-8 text-muted-foreground" />
				</div>
				<p className="text-sm font-medium">Lista vacía</p>
				<p className="text-xs text-muted-foreground">
					Agrega canciones desde la biblioteca de la izquierda
				</p>
			</div>
		</main>
	);
}
