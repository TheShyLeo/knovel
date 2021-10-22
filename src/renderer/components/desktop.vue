<template>
  <div class="container text" @dbclick.prevent="onMouse(5)" :style="color">
    <span>{{ text }}</span>
  </div>
</template>

<script>
import db from "../../main/utils/db";
import { ipcRenderer, remote } from "electron";

export default {
  name: "desktop",
  data() {
    return {
      book: "",
      color: "",
      text: "",
      font_size: "",
    };
  },
  created() {
    this.onLoad();
  },
  mounted() {
    var that = this;
    ipcRenderer.on("bg_text_color", function (event, message) {
      that.onLoad();
    });

    ipcRenderer.on("text", function (event, message) {
      that.text = remote.getGlobal("text").text;
    });
  },
  methods: {
    onLoad() {
      var book_id = db.get("book_id");
      var book = db.getBookById(book_id);
      var bg_color = book.bg_color;
      var txt_color = book.txt_color;
      var font_size = book.font_size;
      // this.text = remote.getGlobal("text").text;

      this.color =
        "background: " +
        bg_color +
        ";color:" +
        txt_color +
        ";font-size:" +
        font_size +
        "px;";
    },
    onMouse(type) {
      if (type == 1) {
        // 鼠标左击
        ipcRenderer.send("MouseAction", "1");
      } else if (type == 2) {
        // 鼠标右击
        ipcRenderer.send("MouseAction", "2");
      } else if (type == 3) {
        // 鼠标进入
        ipcRenderer.send("MouseAction", "3");
      } else if (type == 4) {
        // 鼠标移出
        ipcRenderer.send("MouseAction", "4");
      }else if (type == 5){
        console.log("11111")
      }
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  height: 100%;

    span {
      vertical-align: middle;
      display: table-cell;
    }
  }
.text {
    -webkit-app-region: drag;
    margin: 4px;
  }
</style>
