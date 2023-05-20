import { extendTheme } from "@chakra-ui/react"
// const brand = defineStyle({
//     bgGradient: "linear(to-l, #0172AF, #74FEBD)"
// })

// const buttonTheme = defineStyleConfig({variants: {brand}})

const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        color: "#015871",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        color: "white",
        borderRadius: "xl",
        textTransform: "uppercase"
      },
      variants: {
        brand: {
          bgGradient: "linear(to-l, #0172AF, #4FD1C5)",
          transition: "background-color 500ms ease",
          _hover: {
            bgGradient: "linear(to-r, #0172AF, #4FD1C5)",

            _disabled: {
              bgGradient: "linear(to-r, #0172AF, #4FD1C5)",
            },
          },
        },
      },
    },
  },
})

export default customTheme
