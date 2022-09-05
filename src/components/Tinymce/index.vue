<template>
  <editor ref="editor" v-model="content" tag-name="div" :init="init" />
</template>

<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import plugins from "./plugins";
import toolbar from "./toolbar";
import { toPublicURL } from "@/app/services/toPublicURL";
import { extractPurText } from "@/utils/string";
import "./zh-Hans";

export default {
  props: {
    modelValue: String,
    height: {
      type: Number,
      default: 300,
    },
    limit: {
      type: Boolean,
      default: false,
    },
    limitNumber: {
      type: Number,
    },
  },
  components: {
    editor: Editor,
  },
  emits: ["update:modelValue"],
  setup(props, context) {
    const init = {
      skin_url: toPublicURL("lightgray"), // 编辑器皮肤样式
      content_css: toPublicURL("lightgray/content.min.css"),
      menubar: "", // 隐藏菜单栏
      autoresize_bottom_margin: 50,
      max_height: props.height,
      min_height: 100,
      toolbar_mode: "none",
      plugins: plugins,
      toolbar: toolbar,
      content_style: "p {margin: 5px 0; font-size: 14px}",
      fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
      font_formats:
        "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
      branding: false,
      elementpath: false,
      resize: false, // 禁止改变大小
      statusbar: false, // 隐藏底部状态栏
      //   图片上传
      images_upload_handler: function (blobInfo, success) {
        var reader = new FileReader();
        reader.readAsDataURL(blobInfo.blob());
        reader.onload = function () {
          success(this.result);
        };
      },
      // init_instance_callback: function (editor) {
      //   editor.on("change", function (e) {
      //     textlength.value = editor.contentDocument.body.innerText.length;
      //   });
      // },
    };
    tinymce.init; // 初始化
    const revert_data = (content) => {
      if (props.limit) {
        const text = extractPurText(content);
        if (text.length > props.limitNumber) {
          return;
        } else {
          context.emit("update:modelValue", content);
        }
      } else {
        context.emit("update:modelValue", content);
      }
    };
    return {
      init,
      revert_data,
    };
  },
  data() {
    return {
      content: this.modelValue,
    };
  },
  watch: {
    content(nv) {
      this.revert_data(nv);
    },
  },
};
</script>