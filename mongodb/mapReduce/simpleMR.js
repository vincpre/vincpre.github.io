db.getCollection("zips").mapReduce(
  function map() {
      emit(this.state, this.pop);
  },
  function reduce(key, values) {
    return Array.sum(values);
  },
  {
    out: "total-pop"
  }
);
