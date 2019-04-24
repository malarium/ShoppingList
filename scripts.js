new Vue({
  el: "#app",
  data: {
    newItem: "",
    showList: true,
    showCart: false,
    mockItems: ['ser', 'mleko', 'woda', 'chleb', 'bułki'],
    // mockItems: [],
    boughtItems:['wino', 'zapałki', 'serwetki'],
    // boughtItems: []
  },
  computed: {
    itNr: function() {
      return this.mockItems.length;
    },
    bgNr: function() {
      return this.boughtItems.length;
    }
  },
  methods: {
    submitted: function() {
      if (this.newItem != "") {
        this.mockItems.push(this.newItem);
        this.newItem = "";
      }
    },
    removeAll: function() {
      this.mockItems = [];
    },
    removeAllBought: function() {
      this.boughtItems = [];
    },
    removeThis: function(el) {
      this.mockItems.splice(this.mockItems.indexOf(el), 1);
    },
    haveThis: function(el) {
      this.boughtItems.push(el);
      this.removeThis(el);
    },
    removeBought: function(el) {
      this.boughtItems.splice(this.boughtItems.indexOf(el), 1);
      this.newItem = el;
      this.submitted();
    },
    toggleVisibilityList: function() {
      this.showList = true;
      this.showCart = false;
    },
    toggleVisibilityCart: function() {
      this.showList = false;
      this.showCart = true;
    },
  }
});
