import { a, array, div, footer, h1, h2, h3, main, p, section, span, subscribe, tag } from "taggedjs";
import { Header } from "../components/Header.tag.js";
import { contact } from "../data/contact.js";

type ContactState = {
  menuOpen: boolean;
};

const contactState$ = array<ContactState>([{ menuOpen: false }]);

const getState = () => contactState$[0] || { menuOpen: false };

const update = (patch: Partial<ContactState>) => {
  contactState$[0] = {
    ...getState(),
    ...patch,
  };
};

const MobileContactBar = () =>
  div.class`mobile-contact-bar`(
    a.href(contact.textHref)("Text"),
    a.href(contact.phoneHref)("Call"),
    a.href(contact.emailHref)("Email")
  );

const SiteFooter = () =>
  footer.class`site-footer`(
    div(
      h2("DD's Sweet Shack"),
      p("Sweet treats, made with love")
    ),
    div.class`footer-links`(
      a.href(`${import.meta.env.BASE_URL}`)("Home"),
      a.href(`${import.meta.env.BASE_URL}custom-order.html`)("Custom Order")
    )
  );

export const ContactApp = tag(() =>
  subscribe(contactState$, ([state]) => [
    Header({
      menuOpen: state.menuOpen,
      onToggleMenu: () => update({ menuOpen: !state.menuOpen }),
      onCloseMenu: () => update({ menuOpen: false }),
    }),
    main.class`contact-page-main`(
      section.class`section contact-page-section`(
        div.class`section-heading`(
          span.class`section-kicker`("Contact"),
          h1("Let's talk sweets"),
          p("🧁 Reach out for custom cakes, cupcakes, cookies, party favors, seasonal treats, and availability.")
        ),
        div.class`contact-grid`(
          a.class`contact-card`.href(contact.phoneHref)(span("📞 Call"), h3(contact.phoneDisplay)),
          a.class`contact-card`.href(contact.textHref)(span("📱 Text"), h3(contact.phoneDisplay)),
          a.class`contact-card`.href(contact.emailHref)(span("✉️ Email"), h3(contact.email)),
          div.class`contact-card`(span("📍 Location"), h3(contact.location)),
          a.class`contact-card`.href(contact.facebookHref).attr("target", "_blank").attr("rel", "noreferrer")(span("💬 Facebook"), h3(contact.facebookName)),
          div.class`contact-card`(span("🌐 Website"), h3(contact.website))
        ),
        div.class`contact-page-cta`(
          a.class`primary-button`.href(`${import.meta.env.BASE_URL}custom-order.html`)("Custom Order"),
          a.class`secondary-button`.href(contact.textHref)("Text Us")
        )
      )
    ),
    SiteFooter(),
    MobileContactBar(),
  ])
);
