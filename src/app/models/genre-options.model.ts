export class GenreOptions {
  public all: Genre[];
  public childrensBooks = new Genre({
    value: `api_subject:barnebøker`,
    viewValue: 'Barnebøker',
    mediaType: 'bøker',
    avatar:
      'https://www.nb.no/services/image/resolver/URN:NBN:no-nb_digibok_2012092408134_C1/full/245,245/0/native.jpg'
  });
  public scienceFictionAndFantasy = new Genre({
    value: `api_subject:fantasy science fiction`,
    viewValue: 'Fantasy og Science fiction',
    mediaType: 'bøker',
    avatar:
      'https://www.nb.no/services/image/resolver/URN:NBN:no-nb_digibok_2012100907096_C1/full/245,245/0/native.jpg'
  });
  public outdoorLife = new Genre({
    value: `api_subject:friluftsliv`,
    viewValue: 'Friluftsliv',
    mediaType: 'bøker',
    avatar:
      'https://www.nb.no/services/image/resolver/URN:NBN:no-nb_digibok_2012060824033_C1/full/245,245/0/native.jpg'
  });
  public mysteryAndCrime = new Genre({
    value: `api_subject:krim spenning`,
    viewValue: 'Krim og spenning',
    mediaType: 'bøker',
    avatar:
      'https://www.nb.no/services/image/resolver/URN:NBN:no-nb_digibok_2009021204007_C1/full/245,245/0/native.jpg'
  });
  public nonfiction = new Genre({
    value: `api_subject:lærebøker`,
    viewValue: 'Lærebøker',
    mediaType: 'bøker',
    avatar:
      'https://www.nb.no/services/image/resolver/URN:NBN:no-nb_digibok_2013012407087_C1/full/245,245/0/native.jpg'
  });
  public food = new Genre({
    value: `api_subject:mat`,
    viewValue: 'Mat',
    mediaType: 'bøker',
    avatar:
      'https://www.nb.no/services/image/resolver/URN:NBN:no-nb_digibok_2016020807586_C1/full/245,245/0/native.jpg'
  });
  public fiction = new Genre({
    value: `api_subject:Skjønnlitteratur`,
    viewValue: 'Skjønnlitteratur',
    mediaType: 'bøker',
    avatar:
      'https://www.nb.no/services/image/resolver/URN:NBN:no-nb_digibok_2012092606001_C1/full/245,245/0/native.jpg'
  });

  constructor() {
    this.all = [
      this.childrensBooks,
      this.scienceFictionAndFantasy,
      this.outdoorLife,
      this.mysteryAndCrime,
      this.nonfiction,
      this.food,
      this.fiction
    ];
  }
}

export class Genre {
  value? = null;
  viewValue? = null;
  mediaType? = null;
  avatar? = null;

  constructor(fields?: {
    value?: string;
    viewValue?: string;
    mediaType?: string;
    avatar?: string;
  }) {
    if (fields) {
      this.value = fields.value || this.value;
      this.viewValue = fields.viewValue || this.viewValue;
      this.mediaType = fields.mediaType || this.mediaType;
      this.avatar = fields.avatar || this.avatar;
    }
  }
}
