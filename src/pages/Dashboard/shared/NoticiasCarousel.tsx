import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { DashboardNewsItem } from "./dashboardProfileTypes";

interface NoticiasCarouselProps {
	items: DashboardNewsItem[];
	intervalMs?: number;
}

export function NoticiasCarousel({
	items,
	intervalMs = 7000,
}: NoticiasCarouselProps) {
	const [activeSlide, setActiveSlide] = useState(0);
	const hasItems = items.length > 0;
	const currentSlide = hasItems ? activeSlide % items.length : 0;

	useEffect(() => {
		if (items.length < 2) return;
		const interval = window.setInterval(
			() => setActiveSlide((current) => (current + 1) % items.length),
			intervalMs,
		);
		return () => window.clearInterval(interval);
	}, [intervalMs, items.length]);

	if (!hasItems) return null;

	const previous = () =>
		setActiveSlide((current) => (current === 0 ? items.length - 1 : current - 1));
	const next = () => setActiveSlide((current) => (current + 1) % items.length);

	return (
		<section className="mb-6" aria-label="Avisos e notícias">
			<div className="mb-3 flex justify-end">
				<div className="flex gap-2" aria-label={`Notícia ${currentSlide + 1} de ${items.length}`}>
					{items.map((item, index) => (
						<button
							key={item.id}
							type="button"
							onClick={() => setActiveSlide(index)}
							aria-label={`Exibir notícia ${index + 1}`}
							aria-current={index === currentSlide}
							className="h-1 w-12 overflow-hidden rounded-full bg-gray-300"
						>
							<span
								className={`block h-full bg-[#1A7A3C] transition-all duration-500 ${index === currentSlide ? "w-full" : "w-0"}`}
							/>
						</button>
					))}
				</div>
			</div>

			<div className="relative h-[420px] overflow-hidden rounded-2xl bg-gray-900 shadow-sm sm:h-[400px]">
				{items.map((item, index) => (
					<article
						key={item.id}
						aria-hidden={index !== currentSlide}
						className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`}
					>
						<img src={item.image} alt={item.imageAlt} className="absolute inset-0 h-full w-full object-cover" />
						<div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10" />
						<div className="absolute inset-0 flex max-w-3xl flex-col justify-end p-6 sm:p-9 md:p-12">
							<span className="mb-4 w-fit rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#1A7A3C]">
								{item.category}
							</span>
							<h3 className="max-w-2xl text-2xl font-bold leading-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl">
								{item.title}
							</h3>
							<p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/85 sm:text-base">
								{item.description}
							</p>
							<button
								type="button"
								onClick={item.onAction}
								className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-gray-900 shadow-xl transition hover:bg-gray-100"
							>
								{item.actionLabel}
								{item.actionIcon ?? <ArrowRight size={18} />}
							</button>
						</div>
					</article>
				))}

				{items.length > 1 && (
					<div className="absolute bottom-5 right-5 z-20 flex gap-3 sm:bottom-8 sm:right-8">
						<button type="button" onClick={previous} aria-label="Notícia anterior" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-md transition hover:bg-white/20">
							<ChevronLeft size={22} />
						</button>
						<button type="button" onClick={next} aria-label="Próxima notícia" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-md transition hover:bg-white/20">
							<ChevronRight size={22} />
						</button>
					</div>
				)}
			</div>
		</section>
	);
}
