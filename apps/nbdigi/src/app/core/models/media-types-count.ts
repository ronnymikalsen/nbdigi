export class MediaTypeCount {
  mediaType = '';
  count? = 0;

  constructor(fields?: { mediaType: string; count?: number }) {
    if (fields) {
      this.mediaType = fields.mediaType || this.mediaType;
      this.count = fields.count || this.count;
    }
  }
}
