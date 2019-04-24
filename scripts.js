new Vue({
  el: "#app",
  data: {
    newItem: "",
    showList: true,
    showCart: false,
    // mockItems: ["ser", "mleko", "woda", "chleb", "bułki"],
    // boughtItems: ["wino", "zapałki", "serwetki"],
    mockItems: [],
    boughtItems: []
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
    addToShoppingList: function(tag) {
      if(tag.length > 20){alert('za długie')}
      this.mockItems.push(tag);
    },
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
    haveThis: function(el, ev) {
      // ev.target.parentNode.classList.add('addToCart');
      if(this.mockItems.includes(el)) {
        this.boughtItems.push(el);
        this.removeThis(el);
      } else {
        alert(el)
      }
     
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
    toggleVisibility: function(ev) {
      let mainButtons = document.querySelectorAll(".mainButtons");
      Array.from(mainButtons).forEach(function(b) {
        b.classList.remove("boldText");
      });
      ev.target.classList.add("boldText");
      ev.target.classList.contains("cart")
        ? this.toggleVisibilityCart()
        : this.toggleVisibilityList();
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      if (!annyang) {
        alert("Your device doesn't support speech recognition");
      } else {
        annyang.setLanguage("pl");
        annyang.start({ autoRestart: true, continuous: true });
        annyang.addCommands({
          'kup *tag': this.addToShoppingList,
          'mam *tag': this.haveThis,
          'koniec': this.removeAll
        });
      }
    });
  }
});
