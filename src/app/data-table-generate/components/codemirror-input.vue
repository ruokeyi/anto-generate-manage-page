<template>
  <codemirror
          v-bind="$attrs"
          @change="handleChange"
          :options="cmOptions"
        ></codemirror>
</template>
<script>
import { Codemirror } from "vue-codemirror";
// import "codemirror/lib/codemirror.css";
// import "codemirror/theme/base16-dark.css";
// import "codemirror/theme/blackboard.css";
// import "codemirror/theme/ambiance.css";
// import "codemirror/theme/ayu-dark.css";
// import "codemirror/addon/fold/foldgutter.css";
// import "codemirror/addon/fold/foldcode";
// import "codemirror/addon/fold/foldgutter";
// import "codemirror/addon/fold/brace-fold";
// import "codemirror/addon/fold/comment-fold";
// import "codemirror/mode/javascript/javascript.js";
export default {
  components:{Codemirror},
  data(){
    return {
      cmOptions: {
        tabSize: 2,
        mode: {
          name: "yaml",
          json: false,
        },
        lineNumbers: true,
        line: true,
        lineWrapping: true,
        theme: "base16-dark", //default, base16-dark blackboard  ayu-dark
        tabSize: 4,
        styleActiveLine: true,
        foldGutter: true,
        lineWrapping: true,
        gutters: [
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter",
          "CodeMirror-lint-markers",
        ],
      },
    }
  },
  methods:{
    handleChange(e){
      console.log(e)
    }
  }
}
</script>