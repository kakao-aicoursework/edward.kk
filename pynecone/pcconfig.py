import pynecone as pc

class HelperbotConfig(pc.Config):
    pass

config = HelperbotConfig(
    app_name="helper_bot",
    db_url="sqlite:///pynecone.db",
    env=pc.Env.DEV,
)