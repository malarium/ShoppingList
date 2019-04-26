new Vue({
  el: "#app",
  data: {
    newItem: "",
    showList: true,
    showCart: false,
    clue: "msg",
    clueActive: false,
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
    displayClue: function(txt) {
      setTimeout(
        function() {
          this.clueActive = false;
        }.bind(this),
        3500
      );
      this.clue = txt;
      this.clueActive = true;
    },
    addToShoppingList: function(tag) {
      if (this.boughtItems.includes(tag)) {
        this.removeBought(tag);
      } else {
        this.mockItems.push(tag);
        localStorage.setItem("list", JSON.stringify(this.mockItems));
      }
    },
    submitted: function() {
      if (this.newItem != "") {
        this.mockItems.push(this.newItem);
        this.newItem = "";
      }
    },
    removeAll: function() {
      this.mockItems = [];
      this.boughtItems = [];
      localStorage.removeItem("list");
      localStorage.removeItem("cart");
    },
    removeAllBought: function() {
      this.boughtItems = [];
      localStorage.removeItem("cart");
    },
    removeThis: function(el) {
      if(this.mockItems.includes(el)) {
        this.mockItems.splice(this.mockItems.indexOf(el), 1);
        localStorage.setItem("list", JSON.stringify(this.mockItems));
      } else {
        this.displayClue("Nie mogę usunąć, nie ma na liście");
      }
    },
    haveThis: function(el) {
      if (this.mockItems.includes(el)) {
        this.boughtItems.push(el);
        localStorage.setItem("cart", JSON.stringify(this.boughtItems));
        this.removeThis(el);
      } else {
        this.displayClue("Nie masz tego na liście zakupów");
      }
    },
    removeBought: function(el) {
      this.boughtItems.splice(this.boughtItems.indexOf(el), 1);
      localStorage.setItem("cart", JSON.stringify(this.boughtItems));
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
    },
    retrieveFromStorage: function() {
      let retrievedData = localStorage.getItem("list");
      let retrievedCart = localStorage.getItem("cart");
      // jeżeli jest coś w local storage, to wyświetl
      if (retrievedData) {
        let parsed = JSON.parse(retrievedData);
        parsed.forEach(item => {
          this.mockItems.push(item);
        });
      }
      if (retrievedCart) {
        let parsed = JSON.parse(retrievedCart);
        parsed.forEach(item => {
          this.boughtItems.push(item);
        });
      }
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.retrieveFromStorage();
      document.querySelector(".list").click();
      if (!annyang) {
        this.displayClue(
          "Twoja przeglądarka nie obsługuje funkcji rozpoznawania mowy. Użyj Chrome."
        );
      } else {
        annyang.setLanguage("pl");
        annyang.start({ autoRestart: true, continuous: false });
        annyang.addCommands({
          "kup *tag": this.addToShoppingList,
          "mam *tag": this.haveThis,
          koszyk: function() {
            document.querySelector(".cart").click();
          },
          lista: function() {
            document.querySelector(".list").click();
          },
          koniec: this.removeAll,
          "usuń z listy *tag": this.removeThis
        });
      }
      //SW initialization
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
          });
        });
      }
    });
  }
});
