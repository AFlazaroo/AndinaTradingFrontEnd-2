import { AfterViewInit, Component, ElementRef } from '@angular/core';
import Swiper from 'swiper';
import { Autoplay, Navigation } from 'swiper/modules';
import { RouterModule } from '@angular/router';

Swiper.use([Autoplay]);

@Component({
  selector: 'app-pagina-inicio',
  imports: [RouterModule],
  templateUrl: './pagina-inicio.component.html',
  styleUrls: ['./pagina-inicio.component.scss']
})
export class PaginaInicioComponent implements AfterViewInit {
  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    // Fade-in animation con IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Solo una vez
        }
      });
    }, { threshold: 0.1 });

    const sections = this.elRef.nativeElement.querySelectorAll('.fade-in-section');
    sections.forEach((section: Element) => observer.observe(section));

    // SwiperJS carrusel
    new Swiper('.swiper-container', {
      slidesPerView: 3,
      spaceBetween: 30,
      loop: true,
      centeredSlides: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30
        }
      }
    });
  }
}