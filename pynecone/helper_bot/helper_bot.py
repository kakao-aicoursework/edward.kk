import pynecone as pc
from pynecone.base import Base
from datetime import datetime

from helper_bot.ai import ai_request

class Message(Base):
    text: str
    created_at: str
    isBot: bool

class State(pc.State):
    loading: bool = False
    messages: list[Message] = []

    async def handle_submit(self, form_data: dict):
        def addMessage(text: str, isBot: bool):
            self.messages = self.messages + [
                Message(
                    text=text,
                    isBot=isBot,
                    created_at=datetime.now().strftime("%B %d, %Y %I:%M %p"),
                )
            ]

        if(self.loading):
            return

        message = form_data["message"]
        if not message.strip():
            return

        self.loading = True
        addMessage(text=message, isBot=False)
        yield

        res_message = ai_request(message=message)
        addMessage(text=res_message, isBot=True)
        self.loading = False
        yield pc.set_value("message", "")
    pass

def message(message: Message):
 
    return pc.cond(
        message.isBot,
        pc.box(
            pc.markdown(message.text),
            display="inline_flex",
            flex_wrap="wrap",
            gap="0.5rem",
            font_size="14px",
            background_color="#f5f5f5",
            padding="0.75rem 1rem",
            border_radius="8px",
            margin_right="7%"
        ),
        pc.box(
            pc.text(message.text),
            align_self="end",
            display="inline_flex",
            font_size="14px",
            color="#fff",
            background_color="#3B82F6",
            padding="0.5rem",
            border_radius="8px",
            margin_left="7%"
        )
    )

def index() -> pc.Component:
    return pc.fragment(
        pc.vstack(
            pc.box(
                pc.text("🤖", font_size="1em"),
                text_algin="center",
                margin_top="40px"
            ),
            pc.box(
                pc.foreach(State.messages, message),
                pc.cond(State.loading, pc.button('', is_loading=True), pc.text('')),
                margin="2rem 0",
                display="flex",
                flex_direction="column",
                gap="1rem",
                align_items="start",
                width="100%",
                height="100%",
                overflow_y="auto",
            ),
            pc.form(
                pc.hstack(
                    pc.input(
                        id="message",
                        placeholder="질문을 입력해주세요.",
                        border_color="#eaeaef",
                        width="100%",
                        is_disabled=State.loading,
                    ),
                    pc.button(
                        "묻기",
                        type_="submit",
                        is_loading=State.loading,
                    ),
                    display="flex",
                    align_items="center",
                    margin_top="auto",
                    margin_bottom="50px"
                ),
                on_submit=State.handle_submit,
                width="100%",
            ),
            spacing="1em",
            font_size="2em",
            padding="0 10%",
            margin="0 auto",
            max_width="700px",
            box_sizing="content-box",
            height="100vh"
        ),
    )

# Add state and page to the app.
app = pc.App(
    state=State, 
    style={
    }
)
app.add_page(index)
app.compile()
