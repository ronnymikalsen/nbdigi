export class Hints {
  creators?: Hint[];
  places?: Hint[];

  constructor(fields?: { creators?: Hint[]; places?: Hint[] }) {
    if (fields) {
      this.creators = fields.creators || this.creators;
      this.places = fields.places || this.places;
    }
  }
}

export class Hint {
  public type: string;
  public label: string;
  public value: string;
  public enabled = true;

  constructor(fields?: { type?: string; label?: string; value?: string; enabled?: boolean }) {
    if (fields) {
      this.type = fields.type || this.type;
      this.label = fields.label || this.label;
      this.value = fields.value || this.value;
      this.enabled = fields.enabled !== undefined ? fields.enabled : this.enabled;
    }
  }
}
