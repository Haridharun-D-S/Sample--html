import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SplitterHtml, SplitterCss, SplitterTs } from './splitterCode';

@Component({
  selector: 'app-nd-splitter',
  templateUrl: './nd-splitter.component.html',
  styleUrls: ['./nd-splitter.component.scss'],
})
export class NdSplitterComponent {
  htmlsplitterCode=SplitterHtml;
  csssplitterCode= SplitterCss;
  tssplitterCode= SplitterTs;
  splitForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.splitForm = this.fb.group({
      direction: ['horizontal'],
      leftSize: [35],
      rightSize: [65],
      gutterSize: [8],
      minRight: [40],
      minLeft: [30],
    });
  }

  get f() {
    return this.splitForm.value;
  }

}
