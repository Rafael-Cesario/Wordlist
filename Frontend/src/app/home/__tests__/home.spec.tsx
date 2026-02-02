import "@testing-library/jest-dom";
import Page from "../page";
import userEvent from "@testing-library/user-event";
import { User } from "@/requests/interfaces/userInterface";
import { render, screen } from "@testing-library/react";
import { folderRequests } from "@/requests/FolderRequests";

vi.mock("@/requests/FolderRequests", () => {
  return {
    folderRequests: {
      create: vi.fn().mockImplementation((data) => {
        return { data: { ...data, id: "1" } };
      }),
    },
  };
});

describe("Home", () => {
  describe("Create folder", () => {
    const renderComponent = () => {
      const { getByRole } = render(<Page />);

      const openCreateFolder = getByRole("button");

      return { openCreateFolder };
    };

    beforeAll(() => {
      const user: User = { id: "1", name: "user", email: "user@email.com", createdAt: new Date().toDateString() };
      localStorage.setItem("user", JSON.stringify(user));
    });

    it("Should open create folder input", async () => {
      const { openCreateFolder } = renderComponent();
      const user = userEvent.setup();

      await user.click(openCreateFolder);

      const inputName = screen.getByTestId("folderNameInput");

      expect(inputName).toBeInTheDocument();
    });

    it("Should not create a folder if name is empty", async () => {
      const { openCreateFolder } = renderComponent();
      const user = userEvent.setup();

      await user.click(openCreateFolder);

      const buttonCreate = screen.getByTestId("createFolderButton");
      await user.click(buttonCreate);

      const foldersContainer = screen.getByTestId("foldersContainer");

      expect(foldersContainer.children.length).toBe(0);
    });

    it("Should show a notification with an error", async () => {
      vi.mocked(folderRequests.create).mockResolvedValueOnce({ error: "Error" });

      const { openCreateFolder } = renderComponent();
      const user = userEvent.setup();

      await user.click(openCreateFolder);

      const inputName = screen.getByTestId("folderNameInput");
      const buttonCreate = screen.getByTestId("createFolderButton");

      await user.type(inputName, "folder 1");
      await user.click(buttonCreate);

      const notificationText = screen.getByTestId("notification-text");

      expect(notificationText.textContent).toBe("Error");
    });

    it("Should show a notification with a success message", async () => {
      const { openCreateFolder } = renderComponent();
      const user = userEvent.setup();

      await user.click(openCreateFolder);

      const inputName = screen.getByTestId("folderNameInput");
      const buttonCreate = screen.getByTestId("createFolderButton");

      await user.type(inputName, "folder 1");
      await user.click(buttonCreate);

      const notificationText = screen.getByTestId("notification-text");

      expect(notificationText.textContent).toBe("Sua nova pasta foi criada");
    });

    it("Should create a new folder", async () => {
      const { openCreateFolder } = renderComponent();
      const user = userEvent.setup();
      const folderName = "Folder 01";

      await user.click(openCreateFolder);

      const inputName = screen.getByTestId("folderNameInput");
      const buttonCreate = screen.getByTestId("createFolderButton");

      await user.type(inputName, folderName);
      await user.click(buttonCreate);

      const foldersContainer = screen.getByTestId("foldersContainer");

      expect(foldersContainer.children.length).toBe(1);
      expect(foldersContainer.children[0].textContent).toBe(folderName);
    });

    it("Should clean input after creation", async () => {
      const { openCreateFolder } = renderComponent();
      const user = userEvent.setup();

      await user.click(openCreateFolder);

      const inputName = screen.getByTestId("folderNameInput") as HTMLInputElement;
      const buttonCreate = screen.getByTestId("createFolderButton");

      await user.type(inputName, "folder 1");
      await user.click(buttonCreate);

      expect(inputName.value).toBe("");
    });
  });
});
