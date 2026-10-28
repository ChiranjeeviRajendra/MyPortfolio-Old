import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { AboutMeComponent } from '../about-me/about-me.component';
import { SkillsComponent } from '../skills/skills.component';
import { ExperienceComponent } from '../experience/experience.component';
import { ProjectsComponent } from '../projects/projects.component';
import { EducationComponent } from '../education/education.component';
import { ContactComponent } from '../contact/contact.component';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgbCarouselConfig, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbCarouselModule, MatCardModule, MatDividerModule, MatExpansionModule, AboutMeComponent, SkillsComponent, ExperienceComponent, ProjectsComponent, EducationComponent, ContactComponent],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent {

  showNavigationArrows = false;
  showNavigationIndicators = false;

  images = [
    'assets/cara1.png',
    'assets/cara2.jpg',
    'assets/cara3.jpg',
    'assets/cara4.jpg',
    'assets/cara5.jpg',
    'assets/cara6.png'
  ]

  constructor() {
    const config = inject(NgbCarouselConfig);
    // customize default values of carousels used by this component tree
    config.interval = 3200;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;

  }

}
