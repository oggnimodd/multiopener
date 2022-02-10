import React, { useState, useEffect } from 'react';
import short from 'short-uuid';

const useLists = () => {
  const [links, setLinks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [rendered, setRendered] = useState(false);

  // Links only modifier
  const addLink = (linkDetails) => {
    const id = short.generate();
    const newLink = {
      ...linkDetails,
      id,
    };

    setLinks((prevLinks) => {
      return [
        ...prevLinks,
        newLink,
      ];
    });

    localStorage.setItem('links', JSON.stringify([
      ...links,
      newLink,
    ]));
  };

  const deleteLink = (id) => {
    const tempLinks = [...links];

    const newLinks = tempLinks.filter((link) => {
      return link.id !== id;
    });

    localStorage.setItem('links', JSON.stringify(newLinks));
    setLinks(newLinks);

    // Delete deleted link from groups

    const tempGroups = [...groups];

    for (let i = 0; i < tempGroups.length; i += 1) {
      const group = tempGroups[i];

      // Find link in group children
      const target = group.children.filter((link) => {
        return link.id === id;
      })[0];

      const targetIndex = group.children.indexOf(target);

      // If link exists in group, delete
      if(targetIndex > -1) {
        group.children.splice(targetIndex, 1);
      }
    }

    setGroups(tempGroups);
    localStorage.setItem('groups', JSON.stringify(tempGroups));
  };

  const updateLink = (id, newValues) => {
    const tempLinks = [...links];

    const targetLink = tempLinks.filter((link) => {
      return link.id === id;
    })[0];

    if(!targetLink || !id) return;

    // New Values must be the last
    const updatedLink = {
      ...targetLink,
      ...newValues,
    };

    const targetIndex = tempLinks.indexOf(targetLink);

    if(targetIndex > -1) {
      tempLinks[targetIndex] = updatedLink;
    }

    setLinks(tempLinks);

    localStorage.setItem('links', JSON.stringify(tempLinks));

    // update link in group too

    const tempGroups = [...groups];

    for (let i = 0; i < tempGroups.length; i += 1) {
      const group = tempGroups[i];

      // Find link in group children
      const target = group.children.filter((link) => {
        return link.id === id;
      })[0];

      const targetIndex = group.children.indexOf(target);

      // If link exists in group, delete
      if(targetIndex > -1) {
        group.children[targetIndex] = updatedLink;
      }
    }

    setGroups(tempGroups);
    localStorage.setItem('groups', JSON.stringify(tempGroups));
  };

  // Delete link only from a certain group
  const removeLinkFromGroup = (groupId, linkId) => {
    // Find group target
    const targetGroup = groups.filter((group) => {
      return group.id === groupId;
    })[0];

    // Find group index
    const targetGroupIndex = groups.indexOf(targetGroup);

    const tempGroups = [...groups];

    const newLinksInGroup = targetGroup.children.filter((link) => {
      return link.id !== linkId;
    });

    tempGroups[targetGroupIndex].children = newLinksInGroup;

    setGroups(tempGroups);

    localStorage.setItem('groups', JSON.stringify(tempGroups));
  };

  // Group only modifier
  const addGroup = (groupDetails) => {
    const id = short.generate();
    const newGroup = {
      id,
      children: [],
      ...groupDetails,
    };

    setGroups((prevGroups) => {
      return [
        ...prevGroups,
        newGroup,
      ];
    });

    localStorage.setItem('groups', JSON.stringify([
      ...groups,
      newGroup,
    ]));
  };

  const deleteGroup = (id) => {
    // Copy Groups
    const tempGroups = [...groups];

    const newGroups = tempGroups.filter((group) => {
      return group.id !== id;
    });

    localStorage.setItem('groups', JSON.stringify(newGroups));

    setGroups(newGroups);
  };

  const updateGroup = (id, newValues) => {
    const tempGroups = [...groups];

    const targetGroups = tempGroups.filter((group) => {
      return group.id === id;
    })[0];

    if(!targetGroups || !id) return;

    // New Values must be the last
    const updatedLink = {
      ...targetGroups,
      ...newValues,
    };

    const targetIndex = tempGroups.indexOf(targetGroups);

    if(targetIndex > -1) {
      tempGroups[targetIndex] = updatedLink;
    }

    setGroups(tempGroups);

    localStorage.setItem('groups', JSON.stringify(tempGroups));
  };

  // React sortable modifying links
  const handleSortableUpdateLinks = (newLinks) => {
    if(rendered) {
      localStorage.setItem('links', JSON.stringify(newLinks));
      setLinks(newLinks);
    }
  };

  // React sortable modifying groups
  const handleSortableUpdateGroups = (newGroups) => {
    if(rendered) {
      localStorage.setItem('groups', JSON.stringify(newGroups));
      setGroups(newGroups);
    }
  };

  // Children of groups
  const handleUpdateChildren = (parentId, newValue) => {
    if(rendered) {
      // Find Parents
      const target = groups.filter((group) => {
        return group.id === parentId;
      })[0];

      const targetIndex = groups.indexOf(target);

      const tempGroups = [...groups];

      tempGroups[targetIndex].children = newValue;

      setGroups(tempGroups);

      localStorage.setItem('groups', JSON.stringify(tempGroups));
    }
  };

  useEffect(() => {
    // chrome.storage.local.get(['links'], (results) => {
    //   setLinks(results);
    // });

    const links = JSON.parse(localStorage.getItem('links'));
    const groups = JSON.parse(localStorage.getItem('groups'));

    setLinks(links);
    setGroups(groups);
    setRendered(true);
  }, []);

  return {
    rendered,
    links,
    groups,
    addLink,
    deleteLink,
    updateLink,
    removeLinkFromGroup,
    addGroup,
    deleteGroup,
    updateGroup,
    handleSortableUpdateLinks,
    handleSortableUpdateGroups,
    handleUpdateChildren,
  };
};

export default useLists;
