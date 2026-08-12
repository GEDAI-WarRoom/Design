import type { ReactNode } from "react";

export interface DashboardProfileDetail {
	id: string;
	label: string;
	value: ReactNode;
}

export interface DashboardProfileHighlight {
	id: string;
	label: string;
	icon?: ReactNode;
}

export interface LinkedRegistrationDetail {
	id: string;
	label: string;
	value: ReactNode;
}

export interface LinkedRegistration {
	id: string;
	title: string;
	icon: ReactNode;
	details: LinkedRegistrationDetail[];
	onView?: () => void;
}

export interface DashboardPendingItem {
	id: string;
	title: string;
	description: string;
	icon: ReactNode;
	details?: string[];
	actionLabel?: string;
	onAction?: () => void;
}

export interface DashboardNewsItem {
	id: string;
	category: string;
	title: string;
	description: string;
	actionLabel: string;
	image: string;
	imageAlt: string;
	actionIcon?: ReactNode;
	onAction?: () => void;
}
