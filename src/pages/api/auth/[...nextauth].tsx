import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId:
        "579400357447-25n5pbi22pp7j19aglhc0bng43991tth.apps.googleusercontent.com",
      clientSecret: "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",
    }),
    AzureADProvider({
      clientId: "75a35713-3817-455f-9615-db43082f8f7c",
      clientSecret: "atl8Q~KoirdiQRtmwvWLrQHlx2mZnn6voRQ~JcZO",
      tenantId: "f8cdef31-a31e-4b4a-93e4-5f571e91255a",
    }),
  ],
});
