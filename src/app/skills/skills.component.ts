import { MatExpansionModule } from '@angular/material/expansion';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatExpansionModule],
  selector: 'app-skills',
  templateUrl: './skills.component.html'
})
export class SkillsComponent {}
