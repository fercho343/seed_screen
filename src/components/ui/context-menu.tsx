import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import type * as React from "react";
import { cn } from "@/lib/utils";

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;

function ContextMenuContent({
	className,
	children,
	...props
}: ContextMenuPrimitive.Popup.Props) {
	return (
		<ContextMenuPrimitive.Portal>
			<ContextMenuPrimitive.Positioner className="isolate z-50 outline-none">
				<ContextMenuPrimitive.Popup
					data-slot="context-menu-content"
					className={cn(
						"z-50 min-w-44 origin-(--transform-origin) overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
						className,
					)}
					{...props}
				>
					{children}
				</ContextMenuPrimitive.Popup>
			</ContextMenuPrimitive.Positioner>
		</ContextMenuPrimitive.Portal>
	);
}

function ContextMenuItem({
	className,
	variant = "default",
	...props
}: ContextMenuPrimitive.Item.Props & { variant?: "default" | "destructive" }) {
	return (
		<ContextMenuPrimitive.Item
			data-slot="context-menu-item"
			data-variant={variant}
			className={cn(
				"relative flex cursor-default items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
				variant === "destructive" &&
					"text-red-400 data-highlighted:bg-red-500/15 data-highlighted:text-red-400",
				className,
			)}
			{...props}
		/>
	);
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<ContextMenuPrimitive.Separator
			data-slot="context-menu-separator"
			className={cn("-mx-1 my-1 h-px bg-border", className)}
			{...props}
		/>
	);
}

export {
	ContextMenu,
	ContextMenuTrigger,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuGroup,
	ContextMenuSeparator,
};
